// src/components/BestSellers.tsx
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
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import LoadingProgress from './LoadingProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
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
    const nextCursor = snap.docs.length === PAGE_SIZE ? snap.docs[snap.docs.length - 1] : undefined;

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
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  return (
    <Box my={8} px={{ xs: 2, md: 6 }}>
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
        <InfiniteScroll
          dataLength={allProducts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<LoadingProgress />}
        >
          <Grid container spacing={3}>
            {allProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}

      {isFetchingNextPage && <LoadingProgress />}
    </Box>
  );
}
