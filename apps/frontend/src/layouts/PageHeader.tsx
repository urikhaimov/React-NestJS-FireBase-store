// src/components/layout/PageHeader.tsx
import { Box, Stack, Typography } from '@mui/material';

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  if (!title && !actions) return null;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
      spacing={2}
      px={1}
      pb={1}
    >
      <Box>
        {title && <Typography variant="h5">{title}</Typography>}
        {description && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {description}
          </Typography>
        )}
      </Box>

      {actions && <Box>{actions}</Box>}
    </Stack>
  );
}
