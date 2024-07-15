import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [LoggerModule],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
