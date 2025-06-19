import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

const languages = ['EN', 'HE', 'RU'];
const currencies = ['USD', 'ILS', 'EUR'];

export const LocaleSwitcher = () => {
  const [language, setLanguage] = useState('EN');
  const [currency, setCurrency] = useState('USD');

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
    // Save to localStorage or context here if needed
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value);
    // Save to localStorage or context here if needed
  };

  return (
    <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Language</InputLabel>
        <Select value={language} label="Language" onChange={handleLanguageChange}>
          {languages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {lang}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Currency</InputLabel>
        <Select value={currency} label="Currency" onChange={handleCurrencyChange}>
          {currencies.map((cur) => (
            <MenuItem key={cur} value={cur}>
              {cur}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
