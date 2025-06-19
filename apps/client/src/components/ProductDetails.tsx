import  { useEffect, useState } from 'react';
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';

const ProductDetails = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={2} padding={2}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body1">${product.price}</Typography>
              <Typography variant="body2">Stock: {product.stock}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductDetails;
