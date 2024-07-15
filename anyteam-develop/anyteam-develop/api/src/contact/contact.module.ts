import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [LoggerModule],
  providers: [ContactService, EmailService],
  controllers: [ContactController],
})
export class ContactModule {}
