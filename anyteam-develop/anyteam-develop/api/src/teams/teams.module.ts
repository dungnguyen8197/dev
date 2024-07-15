import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationUser } from 'src/entity/organization-user.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { TeamsController } from 'src/teams/teams.controller';
import { TeamsService } from 'src/teams/teams.service';
import { OrganizationTeamsRepository } from '../organization-teams/organization-teams.repository';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([OrganizationTeamsRepository, OrganizationUser]),
  ],
  providers: [TeamsService],
  controllers: [TeamsController],
})
export class TeamsModule {}
