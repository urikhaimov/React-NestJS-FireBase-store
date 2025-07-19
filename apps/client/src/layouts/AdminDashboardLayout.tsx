// src/layouts/AdminDashboardLayout.tsx
import {
  Box,
 
} from '@mui/material';
import BaseLayout from './BaseLayout';
import { Outlet } from 'react-router-dom';
export const sidebarWidth = 260;
import { headerHeight, footerHeight,  } from '@client/config/themeConfig';
export default function AdminDashboardLayout() {
  return <BaseLayout showFooter={false}>
    <Box
      sx={{
        mt: `${headerHeight}px`,
        mb: `${footerHeight}px`,
        height: `calc(100vh - ${headerHeight + footerHeight +140}px)`,
    
        mx: 'auto',
      }}
    >{<Outlet />}</Box>
    
    </BaseLayout>;
}
