import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEditableStore } from '../hooks/useEditableStore';

const StoreEditorForm = () => {
  const { editableStore, updateStore } = useEditableStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStore({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    updateStore({ [e.target.name]: e.target.value });
  };

  return (
    <Box mt={4} p={3} borderRadius={4} boxShadow={4} bgcolor="background.paper">
      <Typography variant="h6" mb={2}>
        🛠 Store Editor (Local Only)
      </Typography>

      <TextField
        label="Store Name"
        name="storeName"
        value={editableStore.storeName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Logo URL"
        name="logoUrl"
        value={editableStore.logoUrl}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Primary Color"
        name="primaryColor"
        type="color"
        value={editableStore.primaryColor}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Layout</InputLabel>
        <Select
          name="layout"
          value={editableStore.layout}
          label="Layout"
          onChange={handleSelectChange}
        >
          <MenuItem value="grid">Grid</MenuItem>
          <MenuItem value="list">List</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Mode</InputLabel>
        <Select
          name="mode"
          value={editableStore.mode || 'light'}
          label="Mode"
          onChange={handleSelectChange}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default StoreEditorForm;
