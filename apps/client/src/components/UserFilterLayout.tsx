import React from 'react';
import { Box,  Typography } from '@mui/material';

interface Props {
  title: string;
  collapsedByDefault?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode; // ✅ new
}

export default function UserFilterLayout({ title, collapsedByDefault, children, actions }: Props) {
  return (
    <Box px={2} py={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>
        {actions}
      </Box>
      {children}
    </Box>
  );
}
