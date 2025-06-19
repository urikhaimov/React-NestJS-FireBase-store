import { useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function ProductPage() {
  const { productId } = useParams();
  const { data: product, isLoading } = useProduct(productId!);

  if (isLoading) return <CircularProgress />;
  if (!product) return <Typography>Product not found.</Typography>;

  return (
    <Box
         flexGrow={1}
         display="flex"
         justifyContent="center"
         alignItems="center"
         px={2}
         py={4}
         sx={{
           width: '100%', // Safe
           maxWidth: '100vw', // Prevent overflow
           overflowX: 'hidden', // Enforced here too
         }}
       >
      <Typography variant="h4">{product.name}</Typography>
      <Typography>{product.description}</Typography>
      <Typography>Price: ${product.price}</Typography>
      <Typography>Stock: {product.stock}</Typography>
    </Box>
  );
}