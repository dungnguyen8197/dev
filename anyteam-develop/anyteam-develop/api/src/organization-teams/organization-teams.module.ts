import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationUser } from 'src/entity/organization-user.entity';
import { Organization } from 'src/entity/organization.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { OrganizationTeamsRepository } from './organization-teams.repository';
import { OrganizationTeamsController } from './organization-teams.controller';
import { OrganizationTeamsService } from './organization-teams.service';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([
      OrganizationTeamsRepository,
      OrganizationUser,
      Organization,
    ]),
  ],
  controllers: [OrganizationTeamsController],
  providers: [OrganizationTeamsService],
})
export class OrganizationTeamsModule {}
