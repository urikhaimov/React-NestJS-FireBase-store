// src/components/AdminFilterLayout.tsx

import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';

export interface AdminFilterLayoutProps {
  children: React.ReactNode;
  hasFilters?: boolean;
  actions?: React.ReactNode;
  onClear?: () => void; // ✅ ADD THIS
}

export default function AdminFilterLayout({
  children,
  hasFilters = false,
  actions,
  onClear,
}: AdminFilterLayoutProps) {
  return (
    <Box mb={3}>
      {/* Top Actions Row */}
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        mb={1}
        justifyContent="space-between"
      >
        {actions}

        {hasFilters && onClear && (
          <Button variant="outlined" color="warning" onClick={onClear}>
            Clear Filters
          </Button>
        )}
      </Box>

      {hasFilters && (
        <Typography
          variant="body2"
          sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}
        >
          Filters are active.
        </Typography>
      )}

      <Divider sx={{ mb: 2 }} />

      <Box>{children}</Box>
    </Box>
  );
}
