import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface ScrollContainerProps extends BoxProps {
  children: React.ReactNode;
}

export default function ScrollContainer({
  children,
  sx,
  ...rest
}: ScrollContainerProps) {
  return (
    <Box
      {...rest}
      sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
