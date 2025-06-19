import React, { useEffect, useMemo, useReducer, Suspense, lazy } from 'react';
import {
    Box,
    Typography,
    Paper,

} from '@mui/material';
import type { Product } from '../../types/firebase';
type Props = {
    index: number;
    
    paginatedProducts: Product[]
}

const Row = ({ index,paginatedProducts }: Props) => {
    const product = paginatedProducts[index];
    return (
        <Box  px={1}>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    mb: 2,
                    backgroundColor: 'background.paper',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                }}
            >
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                    ${product.price}
                </Typography>
            </Paper>
        </Box>
    );
};
export default Row;
