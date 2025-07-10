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
import { deleteProduct } from '../../../hooks/useDeleteProduct';
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

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          p: 1,
          gap: 1,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: 80,
            height: 80,
            borderRadius: 1,
            objectFit: 'cover',
            mx: { xs: 'auto', sm: 0 },
          }}
          image={
            product.images?.[0] || 'https://picsum.photos/seed/fallback/100/100'
          }
          alt={product.name}
        />

        <CardContent
          sx={{
            flex: 1,
            textAlign: { xs: 'center', sm: 'left' },
            px: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            $
            {typeof product.price === 'number'
              ? product.price.toFixed(2)
              : Number(product.price).toFixed
                ? Number(product.price).toFixed(2)
                : 'N/A'}{' '}
            • Stock: {product?.stock ?? 'N/A'}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'row' },
            justifyContent: { xs: 'center', sm: 'flex-end' },
            flexWrap: 'wrap',
            ml: { sm: 'auto' },
            px: 1,
            gap: 1,
          }}
        >
          <span {...dragHandleProps}>
            <IconButton disabled={disabled} size="small">
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
          </span>
          <IconButton
            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
            disabled={disabled}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={handleDeleteClick}
            disabled={disabled}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{product.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dispatch({ type: 'CLOSE_DIALOG' })}
            disabled={loading}
          >
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
