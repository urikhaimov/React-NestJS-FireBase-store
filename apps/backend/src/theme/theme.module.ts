// src/theme/theme.module.ts
import { Module } from '@nestjs/common';
import { ThemeController } from './theme.controller';
import { ThemeService } from './theme.service';
import { FirebaseAdminAppProvider } from '../firebase/firebase-admin.provider';

@Module({
  controllers: [ThemeController],
  providers: [ThemeService, FirebaseAdminAppProvider],
})
export class ThemeModule {}
