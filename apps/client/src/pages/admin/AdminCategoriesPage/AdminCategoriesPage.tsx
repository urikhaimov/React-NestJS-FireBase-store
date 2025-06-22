import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import { useCategories, useAddCategory, useDeleteCategory, useUpdateCategory } from '../../../hooks/useCategories';

export default function AdminCategoriesPage() {
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // ✅ fix

  const { data: categories = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const handleAdd = () => {
    if (!newCategory.trim()) {
      setErrorMessage('Name cannot be empty');
      return;
    }

    const exists = categories.some((c) => c.name.toLowerCase() === newCategory.trim().toLowerCase());
    if (exists) {
      setErrorMessage('Category already exists');
      return;
    }

    setErrorMessage('');
    addCategory.mutate(newCategory.trim(), {
      onSuccess: () => {
        setNewCategory('');
      },
    });
  };

  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    updateCategory.mutate({ id: editingId!, name: editName.trim() });
    setEditingId(null);
    setEditName('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <AdminStickyPage title="Admin Categories">
      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="New Category"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            if (errorMessage) setErrorMessage('');
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
                  <IconButton onClick={handleCancel}><CloseIcon /></IconButton>
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
                onChange={(e) => setEditName(e.target.value)}
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
