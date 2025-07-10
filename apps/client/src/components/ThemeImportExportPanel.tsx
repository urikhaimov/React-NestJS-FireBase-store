// src/components/ThemeImportExportPanel.tsx
import React, { useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import { useThemeStore } from '../stores/useThemeStore';
import type { ThemeSettings } from '../stores/useThemeStore';

export const defaultTheme: ThemeSettings = {
  storeName: 'My Store',
  darkMode: false,
  primaryColor: '#1976d2',
  secondaryColor: '#ff4081',
  font: 'Roboto',
  fontSize: 16,           // ✅ added
  fontWeight: 400,        // ✅ added
  logoUrl: '',
  homepageLayout: 'hero',
  productCardVariant: 'compact',
  categoryStyle: 'tabs',
  showSidebar: true,
  maxWidth: 'xl',
  stickyHeader: true,
};
export default function ThemeImportExportPanel() {
  const { themeSettings, updateTheme } = useThemeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  const handleExport = () => {
    const dataStr = JSON.stringify(themeSettings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'theme-settings.json';
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as Partial<ThemeSettings>;
        updateTheme(parsed);
        setToastMessage('Theme imported successfully');
        setToastOpen(true);
      } catch (error) {
        setToastMessage('Invalid theme JSON');
        setToastOpen(true);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    updateTheme(defaultTheme);
    setToastMessage('Theme reset to default');
    setToastOpen(true);
  };

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Import / Export Theme JSON
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button onClick={handleExport} variant="outlined">
          Export Theme
        </Button>

        <Button onClick={handleImportClick} variant="outlined">
          Import Theme
        </Button>

        <Button onClick={handleReset} variant="outlined" color="warning">
          Reset to Default
        </Button>
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled">
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
