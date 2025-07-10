import { Module } from '@nestjs/common';
import { SecurityLogsController } from './security-logs.controller';

@Module({
  controllers: [SecurityLogsController],
})
export class SecurityLogsModule {}
