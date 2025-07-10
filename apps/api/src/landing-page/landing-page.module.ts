import { Module } from '@nestjs/common';
import { LandingPageController } from './landing-page.controller';

@Module({
  controllers: [LandingPageController],
})
export class LandingPageModule {}
