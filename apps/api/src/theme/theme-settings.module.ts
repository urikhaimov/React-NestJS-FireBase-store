import { Module } from '@nestjs/common';
import { ThemeSettingsController } from './theme-settings.controller';

@Module({
  controllers: [ThemeSettingsController],
})
export class ThemeSettingsModule {}
