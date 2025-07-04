// src/components/SectionPreview.tsx
import { Box, Typography } from '@mui/material';
import type { Section } from '../../types/landing';

type Props = {
  section: Section;
};

export default function SectionPreview({ section }: Props) {
  return (
    <Box my={3} px={1}>
      <Typography variant="subtitle1" fontWeight="medium">
        {section.title}
      </Typography>
      {section.subtitle && (
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {section.subtitle}
        </Typography>
      )}
    </Box>
  );
}
