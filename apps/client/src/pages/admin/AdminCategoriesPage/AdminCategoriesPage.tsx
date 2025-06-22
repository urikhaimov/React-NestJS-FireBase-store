import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import { Category } from '../../../types/firebase';
import AdminStickyPage from '../../../layouts/AdminStickyPage';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');

const fetchCategories = async () => {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data: Category[] = await res.json();
    setCategories(data);
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error);
  }
};

 const handleAdd = async () => {
  if (!newCategory.trim()) return;
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    setNewCategory('');
    fetchCategories();
  } catch (error) {
    console.error('❌ Failed to add category:', error);
  }
};
  const handleDelete = async (id: string) => {
  try {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    fetchCategories();
  } catch (error) {
    console.error('❌ Failed to delete category:', error);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminStickyPage title="Admin Categories">
      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Box>
      <List>
        {categories.map((cat) => (
          <ListItem
            key={cat.id}
            secondaryAction={
              <Button color="error" onClick={() => handleDelete(cat.id)}>
                Delete
              </Button>
            }
          >
            <ListItemText primary={cat.name} />
          </ListItem>
        ))}
      </List>
    </AdminStickyPage>
  );
}
