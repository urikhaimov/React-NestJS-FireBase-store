// src/layouts/PageWithStickyFilters.tsx
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode } from 'react';
import {
  footerHeight,
  headerHeight,
  sidebarWidth,
} from '../config/themeConfig';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  children: ReactNode;
  sidebar: ReactNode;
  title?: string;
  subtitle?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function PageWithStickyFilters({
  children,
  sidebar,
  mobileOpen = false,
  onMobileClose,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100vh - ${headerHeight}px)`,
        overflow: 'hidden',
        pt: `calc(${headerHeight}px + 20px)`,
      }}
    >
      {/* Sidebar (Desktop) */}
      {!isMobile && (
        <Box
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            position: 'sticky',
            top: headerHeight,
            alignSelf: 'flex-start',
            height: `calc(100vh - ${headerHeight}px - ${footerHeight}px)`,
            overflowY: 'auto',
            p: 2,
            bgcolor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          {sidebar}
        </Box>
      )}

      {/* Sidebar (Mobile Drawer) */}
      {isMobile && (
        <Drawer anchor="left" open={mobileOpen} onClose={onMobileClose}>
          <Box sx={{ width: sidebarWidth, p: 2 }}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={onMobileClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {sidebar}
          </Box>
        </Drawer>
      )}

      {/* Main content container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'hidden',
            px: { xs: 1, sm: 2 },
            pt: `calc(${headerHeight / 3}px)`,
            pb: footerHeight / 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
