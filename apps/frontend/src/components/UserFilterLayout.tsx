import React from 'react';
import { Box, Typography } from '@mui/material';

export interface FilterLayoutProps {
  title: string;
  children: React.ReactNode;
  collapsedByDefault?: boolean;
  hasFilters?: boolean;
  onClear?: () => void;
  actions?: React.ReactNode;
}

export default function UserFilterLayout({
  title,
  children,
  collapsedByDefault = false,
  hasFilters = false,
  onClear,
  actions,
}: FilterLayoutProps) {
  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>
        {actions}
      </Box>

      {hasFilters && (
        <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: 'text.secondary' }}>
          Filters are active.
        </Typography>
      )}

      {children}
    </Box>
  );
}
