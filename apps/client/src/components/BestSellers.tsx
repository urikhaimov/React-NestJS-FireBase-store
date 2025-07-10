import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { useInfiniteQuery } from '@tanstack/react-query';
import { db } from '../firebase';
import {
  Box,
  Grid,
  Typography,
  Container,
  Button,
} from '@mui/material';
import ProductCard from './ProductCard';
import LoadingProgress from './LoadingProgress';
import type { Product } from '../types/firebase';

const PAGE_SIZE = 4;

export default function BestSellers() {
  const fetchProducts = async ({
    pageParam,
  }: {
    pageParam?: QueryDocumentSnapshot<DocumentData>;
  }) => {
    const baseRef = collection(db, 'products');
    const bestSellersQuery = pageParam
      ? query(baseRef, orderBy('order'), startAfter(pageParam), limit(PAGE_SIZE))
      : query(baseRef, orderBy('order'), limit(PAGE_SIZE));

    const snap = await getDocs(bestSellersQuery);
    const products: Product[] = snap.docs.map((doc) => ({
      ...(doc.data() as Product),
      id: doc.id,
    }));

    const nextCursor =
      snap.docs.length === PAGE_SIZE ? snap.docs[snap.docs.length - 1] : undefined;

    return { products, nextCursor };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchProducts,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.products.length || lastPage.products.length < PAGE_SIZE) {
        return undefined; // 🛑 no more pages
      }
      return lastPage.nextCursor;
    },
  });

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
