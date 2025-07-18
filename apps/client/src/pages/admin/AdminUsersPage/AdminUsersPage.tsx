import React, { useReducer, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  Card,
  CardContent,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Pagination,
  Tooltip,
  useMediaQuery,
  useTheme,
  CardActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PageWithStickyFilters from '../../../layouts/PageWithStickyFilters';
import useDebounce from '../../../hooks/useDebouncedValue';
import { useAdminUsersQuery } from '../../../hooks/useAdminUsersQuery';
import type { User } from '../../../types/User';
import type { Role } from '../../../types/Role';
import LoadingProgress from '../../../components/LoadingProgress';

export default function AdminUsersPage() {
  const { users, isLoading, error, updateUserRole, deleteUser } = useAdminUsersQuery();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);
  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  const [state, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case 'OPEN_CONFIRM':
          return { confirmOpen: true, selectedUser: action.payload };
        case 'CLOSE_CONFIRM':
          return { confirmOpen: false, selectedUser: null };
        default:
          return state;
      }
    },
    { confirmOpen: false, selectedUser: null }
  );

  const handleDelete = async () => {
    if (!state.selectedUser) return;
    await deleteUser(state.selectedUser.id);
    dispatch({ type: 'CLOSE_CONFIRM' });
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [users, debouncedSearch]
  );

  const paginatedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage),
    [filteredUsers, page]
  );

  if (isLoading) return <LoadingProgress />;
  if (error) return <Typography p={4}>❌ Error loading users</Typography>;

  return (
    <PageWithStickyFilters
      title="Manage Users"
      sidebar={
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Search by email"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1); // Reset page on search
            }}
            fullWidth
          />
          <Typography variant="body2" color="text.secondary">
            Showing {filteredUsers.length} users
          </Typography>
        </Box>
      }
    >
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1, py: 1 }}>
        <List>
          {paginatedUsers.map((user) => (
            <Card key={user.id} sx={{ mb: 2, p: 1 }}>
              <CardContent sx={{ pb: 0 }}>
                <Tooltip title={user.email}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                  >
                    {user.email}
                  </Typography>
                </Tooltip>
                <Typography variant="body2" color="text.secondary">
                  Role: {user.role}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', pt: 1 }}>
                <Select
                  size="small"
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="superadmin">Superadmin</MenuItem>
                </Select>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => dispatch({ type: 'OPEN_CONFIRM', payload: user })}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </List>

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filteredUsers.length / usersPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Box>

      <Dialog
        open={state.confirmOpen}
        onClose={() => dispatch({ type: 'CLOSE_CONFIRM' })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{state.selectedUser?.email}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'CLOSE_CONFIRM' })}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageWithStickyFilters>
  );
}
