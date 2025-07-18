import React, { useReducer } from 'react';
import {
  Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AdminStickyPage from '../../layouts/AdminStickyPage';
import {
  useCategories,
  useAddCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../../hooks/useCategories';
import {
  categoryReducer,
  initialCategoryState,
} from './categoryReducer';

export default function AdminCategoriesPage() {
  const [state, dispatch] = useReducer(categoryReducer, initialCategoryState);
  const { newCategory, editingId, editName, errorMessage } = state;

  const { data: categories = [] } = useCategories();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const handleAdd = () => {
    if (!newCategory.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Name cannot be empty' });
      return;
    }

    const exists = categories.some(
      (c) => c.name.toLowerCase() === newCategory.trim().toLowerCase()
    );
    if (exists) {
      dispatch({ type: 'SET_ERROR', payload: 'Category already exists' });
      return;
    }

    addCategory.mutate(newCategory.trim(), {
      onSuccess: () => dispatch({ type: 'RESET_NEW' }),
    });
  };

  const handleEdit = (id: string, name: string) => {
    dispatch({ type: 'SET_EDIT', payload: { id, name } });
  };

  const handleSave = () => {
    if (!editName.trim()) return;

    updateCategory.mutate(
      { id: editingId!, name: editName.trim() },
      {
        onSuccess: () => {
          dispatch({ type: 'CLEAR_EDIT' });
        },
      }
    );
  };

  return (
    <AdminStickyPage title="Admin Categories">
      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="New Category"
          value={newCategory}
          onChange={(e) => {
            dispatch({ type: 'SET_NEW', payload: e.target.value });
            if (errorMessage) dispatch({ type: 'SET_ERROR', payload: '' });
          }}
          error={!!errorMessage}
          helperText={errorMessage}
        />
        <Button variant="contained" onClick={handleAdd}>Add</Button>
      </Box>

      <List>
        {categories.map((cat) => (
          <ListItem
            key={cat.id}
            secondaryAction={
              editingId === cat.id ? (
                <>
                  <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                  <IconButton onClick={() => dispatch({ type: 'CLEAR_EDIT' })}>
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton onClick={() => handleEdit(cat.id, cat.name)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => deleteCategory.mutate(cat.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )
            }
          >
            {editingId === cat.id ? (
              <TextField
                value={editName}
                onChange={(e) =>
                  dispatch({ type: 'SET_EDIT_NAME', payload: e.target.value })
                }
                size="small"
                fullWidth
              />
            ) : (
              <ListItemText primary={cat.name} />
            )}
          </ListItem>
        ))}
      </List>
    </AdminStickyPage>
  );
}
