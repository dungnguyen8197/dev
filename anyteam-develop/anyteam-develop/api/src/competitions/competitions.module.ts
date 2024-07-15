import { Competition } from 'src/entity/competition.entity';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';
import { LoggerModule } from 'src/logger/logger.module';
import { Module } from '@nestjs/common';
import { Team } from 'src/entity/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Competition, Team]), LoggerModule],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
})
export class CompetitionsModule {}
