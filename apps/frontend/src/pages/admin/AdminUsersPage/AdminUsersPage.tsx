import React, { useReducer, useState } from 'react';
import {
  Box, Typography, IconButton, List, ListItem, ListItemText,
  Select, MenuItem, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Button, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import useDebounce from '../../../hooks/useDebouncedValue';
import { useAdminUsersQuery } from '../../../hooks/useAdminUsersQuery';
import type { User } from '../../../types/User';
import type { Role } from '../../../types/Role';

export default function AdminUsersPage() {
  
  const { users, isLoading, error, updateUserRole, deleteUser } = useAdminUsersQuery();

  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);

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

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  if (isLoading) return <Box p={4}><CircularProgress /></Box>;
  if (error) return <Typography p={4}>❌ Error loading users</Typography>;

  return (
    <AdminStickyPage title="Manage Users">
      <Box mb={2}>
        <TextField
          fullWidth
          label="Search by email"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 3, height: '50vh' }}>
        <List>
          {filteredUsers.map((user) => (
            <ListItem
              key={user.id}
              divider
              secondaryAction={
                <>
                  <Select
                    size="small"
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                    sx={{ mr: 2, minWidth: 120 }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="superadmin">Superadmin</MenuItem>
                  </Select>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() =>
                      dispatch({ type: 'OPEN_CONFIRM', payload: user })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={user.email} secondary={`Role: ${user.role}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Dialog open={state.confirmOpen} onClose={() => dispatch({ type: 'CLOSE_CONFIRM' })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{state.selectedUser?.email}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'CLOSE_CONFIRM' })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminStickyPage>
  );
}
