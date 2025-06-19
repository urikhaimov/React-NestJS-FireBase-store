import { motion } from 'framer-motion';
import { Card, CardContent, Typography } from '@mui/material';

export default function ProductCard({ product }: { product: any }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">{product.name}</Typography>
          <Typography>${product.price}</Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}
