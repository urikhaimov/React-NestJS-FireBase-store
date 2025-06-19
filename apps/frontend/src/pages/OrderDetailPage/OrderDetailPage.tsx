import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  email: string;
  total: number;
  status: string;
  createdAt: any;
  items: OrderItem[];
}

const fetchOrderById = async (orderId: string): Promise<Order> => {
  const ref = doc(db, 'orders', orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Order not found');
  return { id: snap.id, ...snap.data() } as Order;
};

export default function OrderDetailPage() {
  const { id: orderId } = useParams<{ id: string }>();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) return <CircularProgress />;
  if (error || !order)
    return (
      <Alert severity="error">
        Order not found or you don’t have access to it.
      </Alert>
    );

  return (
    <PageWithStickyFilters>
      <Typography variant="h4" gutterBottom>
        Order #{order.id}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1">
            {order.email} • {format(order.createdAt.toDate?.(), 'PPPpp')}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Status: <strong>{order.status}</strong>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Total: <strong>${order.total.toFixed(2)}</strong>
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Items
      </Typography>
      <List dense>
        {order.items.map((item, idx) => (
          <ListItem key={idx} disableGutters>
            <img
              src={item.image || '/placeholder.jpg'}
              alt={item.name}
              width={60}
              height={60}
              style={{ marginRight: 16, borderRadius: 8 }}
            />
            <ListItemText
              primary={`${item.name} × ${item.quantity}`}
              secondary={`$${(item.price * item.quantity).toFixed(2)}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
    </PageWithStickyFilters>
  );
}
