import React, { useState } from 'react';
import { db } from '../firebase.js';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { TextField, Button, Box } from '@mui/material';

const ProductForm = ({ product = null, onSave }: { product?: any; onSave?: () => void }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [stock, setStock] = useState(product ? product.stock : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      const docRef = doc(db, 'products', product.id);
      await updateDoc(docRef, { name, price: parseFloat(price), stock: parseInt(stock) });
    } else {
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
      });
    }
    if (onSave) onSave();
    setName('');
    setPrice('');
    setStock('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        type="number"
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        {product ? 'Update Product' : 'Add Product'}
      </Button>
    </Box>
  );
};

export default ProductForm;
