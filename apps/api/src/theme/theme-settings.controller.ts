import { Controller, Get, Post, Body } from '@nestjs/common';

export interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  darkMode?: boolean;
  fontFamily?: string;
}

const defaultThemeSettings: ThemeSettings = {
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  darkMode: false,
  fontFamily: 'Roboto, sans-serif',
};

@Controller('theme-settings')
export class ThemeSettingsController {
  private currentSettings = { ...defaultThemeSettings };

  @Get()
  getThemeSettings(): ThemeSettings {
    return this.currentSettings;
  }

  @Post()
  updateThemeSettings(@Body() updatedSettings: ThemeSettings): ThemeSettings {
    this.currentSettings = { ...this.currentSettings, ...updatedSettings };
    return this.currentSettings;
  }
}
