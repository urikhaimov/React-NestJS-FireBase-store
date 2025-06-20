import React, { ReactNode } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface FilterLayoutProps {
  title: string;
  children: ReactNode;
  collapsedByDefault?: boolean;
  hasFilters?: boolean;
  onClear?: () => void;
  onApply?: () => void;
}

export default function FilterLayout({
  title,
  children,
  collapsedByDefault = false,
  hasFilters = false,
  onClear,
  onApply,
}: FilterLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = React.useState(!collapsedByDefault);

  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        {hasFilters && (
          <Button variant="outlined" color="warning" onClick={onClear}>
            Clear Filters
          </Button>
        )}
        {onApply && (
          <Button variant="contained" color="primary" onClick={onApply}>
            Apply Filters
          </Button>
        )}
      </Box>
      {isMobile ? (
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">{title}</Typography>
          </AccordionSummary>
          <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
      ) : (
        children
      )}
    </Box>
  );
}