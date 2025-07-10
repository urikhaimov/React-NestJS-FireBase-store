import { Typography, Grid, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import AdminStickyPage from '../../../layouts/AdminStickyPage';


export default function AdminHomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    
      <AdminStickyPage title={'Admin Dashboard'}>
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Metrics section */}
        {[
          { label: 'Total Users', value: 123 },
          { label: 'Total Orders', value: 456 },
          { label: 'Total Products', value: 789 },
        ].map(({ label, value }) => (
          <Grid key={label} item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">{label}</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Latest activity section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Latest Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placeholder for recent orders, new users, or system logs.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </AdminStickyPage>
  );
}
