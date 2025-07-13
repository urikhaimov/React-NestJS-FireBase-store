// src/components/BestSellers.tsx
import {
  Box,
  Grid,
  Typography,
  Container,
  Button,
} from '@mui/material';
import ProductCard from './ProductCard';
import LoadingProgress from './LoadingProgress';
import { useBestSellers } from '../hooks/useBestSellers';

export default function BestSellers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useBestSellers();

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        🛍️ Best Sellers
      </Typography>

      {isLoading && allProducts.length === 0 ? (
        <LoadingProgress />
      ) : allProducts.length === 0 ? (
        <Typography textAlign="center" mt={4} color="text.secondary">
          No best sellers found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {allProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {hasNextPage && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="outlined"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
