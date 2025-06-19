import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const AccessDeniedPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      textAlign="center"
      px={2}
    >
      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary">
        You do not have admin permissions.
      </Typography>

      {/* Action buttons */}
      <Stack direction="column" spacing={2} mt={4}>
        <Button component={Link} to="/" variant="outlined">
          Back to Home
        </Button>

        <Button
          component={Link}
          to="/login?admin=true"
          variant="contained"
          color="secondary"
        >
          Login as Admin
        </Button>
      </Stack>
    </Box>
  );
};

export default AccessDeniedPage;
