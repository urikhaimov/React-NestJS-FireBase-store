import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '../../../types/firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { deleteProduct } from '../../../hooks/deleteProduct';

type Props = {
  product: Product;
  onConfirmDelete: (id: string) => void;
  disabled?: boolean; // ✅ add this
};


export default function ProductAdminCard({ product, onConfirmDelete, disabled =false}: Props) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await deleteProduct(product.id);
      onConfirmDelete(product.id);
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product.');
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };
  return (
    <>
      <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
          image={product.imageUrls?.[0] || product.imageUrl || 'https://picsum.photos/seed/fallback/100/100'}
          alt={product.name}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${product.price.toFixed(2)} • Stock: {product.stock}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={() => navigate(`/admin/products/edit/${product.id}`)} disabled={disabled}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={handleDeleteClick} disabled={disabled}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
