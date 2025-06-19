import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Paper } from '@mui/material';
import AdminPageLayout from '../../../layouts/AdminPageLayout';
interface Order {
  id: string;
  userId: string;
  total: number;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, 'orders'));
    const data: Order[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Order, 'id'>),
    }));
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return
  (

    <AdminPageLayout title={'Admin Orders'}>

      {orders.map((order) => (
        <Paper key={order.id} sx={{ p: 2, mb: 2 }}>
          <Typography>Order ID: {order.id}</Typography>
          <Typography>User ID: {order.userId}</Typography>
          <Typography>Total: ${order.total}</Typography>
          <Typography>
            Date: {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </Paper>
      ))}

    </AdminPageLayout>
  );
}
