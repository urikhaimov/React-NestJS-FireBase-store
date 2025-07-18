import { Box, Typography } from '@mui/material';

interface AdminStickyPageProps {
  title: string;
  filters?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminStickyPage({ title, filters, children }: AdminStickyPageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 264px)', // Adjust for header height
      }}
    >
      {/* Sticky Top Header / Filters */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" sx={{ px: { xs: 1, sm: 2 }, pt: 2, pb: 1 }}>
          {title}
        </Typography>
        {filters && <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>{filters}</Box>}
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: { xs: 1, sm: 2 },
          pb: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
