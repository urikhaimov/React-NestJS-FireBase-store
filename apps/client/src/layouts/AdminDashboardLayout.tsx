// src/layouts/AdminDashboardLayout.tsx
import BaseLayout from './BaseLayout';
import { Outlet } from 'react-router-dom';

export default function AdminDashboardLayout() {
  return <BaseLayout showFooter={false}>{<Outlet />}</BaseLayout>;
}
