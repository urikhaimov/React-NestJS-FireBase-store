import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCartStore } from '../store/cartStore';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose} sx={{ color: 'primary.contrastText' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {items.map((item) => (
              <Fade in key={item.id}>
                <ListItem sx={{ mb: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <ListItemText
                      primary={item.name}
                      secondary={`$${item.price.toFixed(2)} × ${item.quantity}`}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button variant="outlined" size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        -
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </Button>
                      <Button color="error" size="small" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </ListItem>
              </Fade>
            ))}
          </List>
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Total: ${subtotal.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mb: 1 }}
            disabled={items.length === 0} // ✅ disable if empty
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
          >
            Checkout
          </Button>
          <Button variant="outlined" color="error" fullWidth onClick={clearCart}>
            Clear Cart
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
export default CartDrawer;