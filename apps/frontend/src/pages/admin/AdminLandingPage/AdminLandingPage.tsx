import { Box, Typography } from '@mui/material';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import PageHeader from '../../../layouts/PageHeader';

export default function AdminLandingPage() {
  return (
    <AdminStickyPage title="Admin Categories">
      <PageHeader
        title="Landing Page"
        description="Customize your store's homepage layout, banners, and sections"
      />

      <Box mt={2}>
        <Typography variant="body1" color="text.secondary">
          This is the admin landing page editor. You can manage featured products, banners,
          and other homepage content here.
        </Typography>
        {/* You can replace this with actual components: WYSIWYG editor, section reordering, etc. */}
      </Box>
    </AdminStickyPage>
  );
}
