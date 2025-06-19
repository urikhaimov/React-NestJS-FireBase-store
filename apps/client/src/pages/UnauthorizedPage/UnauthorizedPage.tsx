import { Typography, Box } from '@mui/material';

export default function UnauthorizedPage() {
  return (
     <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          px={2}
          py={4}
          sx={{
            width: '100%', // Safe
            maxWidth: '100vw', // Prevent overflow
            overflowX: 'hidden', // Enforced here too
          }}
        >
      <Typography variant="h3">403 - Unauthorized</Typography>
      <Typography>You don’t have access to this page.</Typography>
    </Box>
  );
}
