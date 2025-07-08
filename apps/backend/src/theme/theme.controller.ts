// src/theme/theme.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeSettings } from './theme.model';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  async getTheme(): Promise<ThemeSettings | null> {
    return this.themeService.getTheme();
  }

  @Put()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async updateTheme(@Body() data: Partial<ThemeSettings>) {
    await this.themeService.updateTheme(data);
    return { success: true };
  }
}
