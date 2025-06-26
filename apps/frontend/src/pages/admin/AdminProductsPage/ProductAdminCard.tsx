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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import { deleteProduct } from '../../../hooks/deleteProduct';
import { reducer, initialState } from './CardReducer';
import type { Product } from '../../../types/firebase';

export type Props = {
  product: Product;
  onConfirmDelete: (id: string) => void;
  disabled?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
};

export default function ProductAdminCard({
  product,
  onConfirmDelete,
  disabled = false,
  dragHandleProps,
}: Props) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { dialogOpen, loading } = state;

  const handleDeleteClick = () => {
    dispatch({ type: 'OPEN_DIALOG' });
  };

  const handleConfirm = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await deleteProduct(product.id);
      onConfirmDelete(product.id);
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'CLOSE_DIALOG' });
    }
  };
  console.log(product, 'ProductAdminCard');

  return (
    <>
      <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
          image={product.images?.[0] || 'https://picsum.photos/seed/fallback/100/100'}
          alt={product.name}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${product?.price?.toFixed(2) ?? 'N/A'} • Stock: {product?.stock ?? 'N/A'}
          </Typography>
        </CardContent>
        <CardActions>
          <span {...dragHandleProps}>
            <IconButton disabled={disabled}>
              <DragIndicatorIcon />
            </IconButton>
          </span>
          <IconButton
            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
            disabled={disabled}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={handleDeleteClick} disabled={disabled}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog open={dialogOpen} onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'CLOSE_DIALOG' })} disabled={loading}>
            Cancel
          </Button>
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
