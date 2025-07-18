import React, { useReducer } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import PageWithStickyFilters from '../../../layouts/PageWithStickyFilters';
import {
  useCategories,
  useAddCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../../../hooks/useCategories';
import {
  categoryReducer,
  initialCategoryState,
} from './categoryReducer';
import { headerHeight, footerHeight, sidebarWidth } from '../../../config/themeConfig';

export default function AdminCategoriesPage() {
  const [state, dispatch] = useReducer(categoryReducer, initialCategoryState);
  const { newCategory, editingId, editName, errorMessage } = state;

  const theme = useTheme();
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
    <PageWithStickyFilters
      sidebar={
        <Box display="flex" gap={2} width="100%" >
          <TextField
            label="New Category"
            value={newCategory}
            onChange={(e) => {
              dispatch({ type: 'SET_NEW', payload: e.target.value });
              if (errorMessage) dispatch({ type: 'SET_ERROR', payload: '' });
            }}
            error={!!errorMessage}
            helperText={errorMessage}
            size="small"
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>
      }
    >
      <Box
        sx={{
          height: `calc(100vh - ${headerHeight + footerHeight + 140}px)`,
          overflowY: 'auto',
          maxWidth:  `calc(100vh - ${sidebarWidth}px)`, 
          pr: 1,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Admin Categories
        </Typography>

        <List dense>
          {categories.map((cat) => (
            <ListItem
              key={cat.id}
              secondaryAction={
                editingId === cat.id ? (
                  <>
                    <IconButton onClick={handleSave}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => dispatch({ type: 'CLEAR_EDIT' })}>
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => handleEdit(cat.id, cat.name)}>
                      <EditIcon />
                    </IconButton>
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
      </Box>
    </PageWithStickyFilters>
  );
}
