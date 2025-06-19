import React, { useReducer, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import useDebounce from '../../../hooks/useDebouncedValue'; // ✅ import

interface User {
  id: string;
  email: string;
  role: string;
}

interface State {
  confirmOpen: boolean;
  selectedUser: { id: string; email: string } | null;
}

const initialState: State = {
  confirmOpen: false,
  selectedUser: null,
};

function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'OPEN_CONFIRM':
      return { confirmOpen: true, selectedUser: action.payload };
    case 'CLOSE_CONFIRM':
      return initialState;
    default:
      return state;
  }
}

async function fetchUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<User, 'id'>),
  }));
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300); // ✅ debounce

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDelete = async () => {
    if (!state.selectedUser) return;
    try {
      await deleteDoc(doc(db, 'users', state.selectedUser.id));
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      dispatch({ type: 'CLOSE_CONFIRM' });
    }
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
      <Box
        component="section"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2,
          py: 3,
          height: `50vh`,
        }}
      >
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
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
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
                      dispatch({ type: 'OPEN_CONFIRM', payload: { id: user.id, email: user.email } })
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
            <strong>{state.selectedUser?.email}</strong>? This action is permanent.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'CLOSE_CONFIRM' })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminStickyPage>
  );
}
