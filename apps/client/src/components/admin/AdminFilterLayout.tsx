import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export interface FilterLayoutProps {
  title: string;
  children: ReactNode;
  collapsedByDefault?: boolean;
  hasFilters?: boolean;
  onClear?: () => void;
  onApply?: () => void;
  actions?: ReactNode;
}

export default function AdminFilterLayout({
  title,
  children,
  collapsedByDefault = false,
  hasFilters = false,
  onClear,
  onApply,
  actions,
}: FilterLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = React.useState(!collapsedByDefault);

  return (
    <Box mb={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        mb={2}
      >
        <Typography variant="h6">{title}</Typography>
        {actions ?? (
          <Box display="flex" gap={1}>
            {hasFilters && onClear && (
              <Button variant="outlined" color="warning" onClick={onClear}>
                Clear Filters
              </Button>
            )}
            {onApply && (
              <Button variant="contained" color="primary" onClick={onApply}>
                Apply Filters
              </Button>
            )}
          </Box>
        )}
      </Box>
      {children}
    </Box>
  );
}
