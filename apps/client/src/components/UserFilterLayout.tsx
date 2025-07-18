// src/components/layout/UserFilterLayout.tsx

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

export interface FilterLayoutProps {
  children: React.ReactNode;
  collapsedByDefault?: boolean; // Reserved for future collapsible logic
  hasFilters?: boolean;
  onClear?: () => void;
  actions?: React.ReactNode;
}

export default function UserFilterLayout({
  children,
  hasFilters = false,
  actions,
}: FilterLayoutProps) {
  return (
    <Box mb={3}>
      {/* Actions Row (left aligned) */}
      {actions && (
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
          mb={1}
        >
          {actions}
        </Box>
      )}

      {/* Filter active note */}
      {hasFilters && (
        <Typography
          variant="body2"
          sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}
        >
          Filters are active.
        </Typography>
      )}

      <Divider sx={{ mb: 2 }} />

      {/* Content */}
      <Box>
        {children}
      </Box>
    </Box>
  );
}
