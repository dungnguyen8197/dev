import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from 'src/entity/region.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([Region])
  ],
  controllers: [RegionsController],
  providers: [RegionsService]
})
export class RegionsModule {}
