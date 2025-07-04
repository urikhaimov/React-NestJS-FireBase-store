import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Section, SectionType } from '../types/landing';

type Props = {
  sections: Section[];
  onChange: (updated: Section[]) => void;
};

export default function SectionsEditor({ sections, onChange }: Props) {
  const handleAddSection = () => {
    const newSection: Section = {
      id: uuidv4(),
      title: '',
      type: 'text',
      content: '',
    };
    onChange([...sections, newSection]);
  };

  const handleUpdateSection = (index: number, updated: Partial<Section>) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], ...updated };
    onChange(updatedSections);
  };

  const handleRemoveSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    onChange(updatedSections);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Page Sections
      </Typography>

      <Stack spacing={2}>
        {sections.map((section, i) => (
          <Paper key={section.id} sx={{ p: 2 }}>
            <Stack spacing={1}>
              <TextField
                label="Title"
                value={section.title}
                onChange={(e) => handleUpdateSection(i, { title: e.target.value })}
                fullWidth
              />

              <TextField
                select
                label="Type"
                value={section.type}
                onChange={(e) => handleUpdateSection(i, { type: e.target.value as SectionType })}
                fullWidth
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="productGrid">Product Grid</MenuItem>
                <MenuItem value="testimonial">Testimonial</MenuItem>
              </TextField>

              {section.type === 'text' || section.type === 'testimonial' ? (
                <TextField
                  label="Content"
                  value={section.content || ''}
                  onChange={(e) => handleUpdateSection(i, { content: e.target.value })}
                  multiline
                  rows={3}
                  fullWidth
                />
              ) : null}

              {section.type === 'image' ? (
                <TextField
                  label="Image URL"
                  value={section.imageUrl || ''}
                  onChange={(e) => handleUpdateSection(i, { imageUrl: e.target.value })}
                  fullWidth
                />
              ) : null}

              <Box textAlign="right">
                <IconButton onClick={() => handleRemoveSection(i)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Box mt={2}>
        <Button variant="outlined" onClick={handleAddSection}>
          Add Section
        </Button>
      </Box>
    </Box>
  );
}
