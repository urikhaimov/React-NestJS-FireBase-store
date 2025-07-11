// src/api/themeSettings.ts
import { ThemeSettings } from '../types/theme';

export const fetchThemeSettings = async (): Promise<ThemeSettings> => {
  const res = await fetch('/api/theme-settings');
  if (!res.ok) throw new Error('Failed to fetch theme settings');
  return res.json();
};

export const updateThemeSettings = async (
  settings: Partial<ThemeSettings>
): Promise<ThemeSettings> => {
  const res = await fetch('/api/theme-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });

  if (!res.ok) throw new Error('Failed to update theme settings');
  return res.json();
};
