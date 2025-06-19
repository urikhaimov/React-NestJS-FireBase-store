import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
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
    const snapshot = await getDocs(collection(db, 'categories'));
    const data: Category[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, 'id'>),
    }));
    setCategories(data);
  };

  const handleAdd = async () => {
    await addDoc(collection(db, 'categories'), { name: newCategory });
    setNewCategory('');
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'categories', id));
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminStickyPage title={'Admin Categories'}>
  
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
          <ListItem key={cat.id} secondaryAction={
            <Button color="error" onClick={() => handleDelete(cat.id)}>
              Delete
            </Button>
          }>
            <ListItemText primary={cat.name} />
          </ListItem>
        ))}
      </List>
    </AdminStickyPage>
  );
}
