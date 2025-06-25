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

import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import { deleteProduct } from '../../hooks/deleteProduct';
import { reducer, initialState, Props } from './CardReducer';
export default function ProductCard({ product}: Props) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { dialogOpen, loading } = state;


 
  return (
    <>
      <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
          image={product.imageUrls?.[0] || 'https://picsum.photos/seed/fallback/100/100'}
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
          
        </CardActions>
      </Card>

     
    </>
  );
}
