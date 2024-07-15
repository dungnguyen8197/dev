import { GmoService } from './gmo.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule, LoggerModule],
  providers: [GmoService],
  exports: [GmoService],
})
export class GmoModule {}
