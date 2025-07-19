import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  Button,
  Stack,
} from '@mui/material';
import React from 'react';
import { headerHeight, footerHeight } from '../config/themeConfig';

interface Props {
  title?: string | React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onMobileOpen?: () => void;
  showReset?: boolean;
  onReset?: () => void;
  hasFilters?: boolean;
}

export default function PageWithStickyFilters({
  title,
  sidebar,
  children,
  mobileOpen = false,
  onMobileClose,
  onMobileOpen,
  onReset,
  hasFilters,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        height: `calc(100vh - ${headerHeight + footerHeight}px)`,
        overflowY: 'auto',
        px: { xs: 2, md: 6 },
        py: { xs: 2, md: 4 },
        mt: `${headerHeight}px`,
        mb: `${footerHeight}px`,
      }}
    >
      {/* Top Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={1}
      >
        {typeof title === 'string' ? (
          <Typography variant="h6">{title}</Typography>
        ) : (
          title
        )}

        {/* Actions */}
        <Stack direction="row" spacing={1}>
          {onMobileOpen && onMobileClose && isMobile && (
            <Button
              variant="outlined"
              size="small"
              onClick={mobileOpen ? onMobileClose : onMobileOpen}
              sx={{ textTransform: 'none' }}
            >
              {mobileOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          )}
          {onReset && hasFilters && (
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onReset}
              sx={{ textTransform: 'none' }}
            >
              Reset Filters
            </Button>
          )}
        </Stack>
      </Box>

      {/* Main Content Layout */}
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={2}
        flex={1}
        minHeight={0}
        overflow="hidden"
      >
        {/* Sidebar */}
        {isMobile ? (
          <Drawer
            open={!!mobileOpen}
            onClose={onMobileClose}
            anchor="left"
            ModalProps={{ keepMounted: true }}
            PaperProps={{ sx: { width: 280 } }}
          >
            <Box
              sx={{
                height: `calc(100vh - ${headerHeight + footerHeight}px)`,
                overflowY: 'auto',
                px: { xs: 2, md: 6 },
                py: { xs: 2, md: 4 },
                mt: `${headerHeight}px`,
                mb: `${footerHeight}px`,
              }}
            >
              {sidebar}
            </Box>
          </Drawer>
        ) : (
          <Box
            width={280}
            flexShrink={0}
            pr={2}
            sx={{
              borderRight: '1px solid #ddd',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {sidebar}
          </Box>
        )}

        {/* Main content */}
        <Box
          flex={1}
          minWidth={0}
          overflow="auto"
          sx={{
            height: isMobile ? 'auto' : 'calc(100vh - 180px)',
            pb: isMobile ? 8 : 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
