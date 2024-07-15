import { LoggerModule } from 'src/logger/logger.module';
import { PaymentTeamSummaryRepository } from './../payment-team-summaries/payment-team-summaries.repository';
import { PaymentOrganizationSummaryRepository } from './../payment-organization-summaries/payment-organization-summaries.repository';
import { FilesService } from 'src/files/files.service';
import { FinancialInstitution } from 'src/entity/financial_institution.entity';
import { FinancialInstitutionsService } from 'src/financial-institutions/financial-institutions.service';
import { Module } from '@nestjs/common';
import { OrganizationDivisionType } from 'src/entity/organization-division-type.entity';
import { OrganizationRepository } from './organizations.repository';
import { OrganizationType } from 'src/entity/organization-type.entity';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { Region } from 'src/entity/region.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSupportTeamSummaryRepository } from '../payment_support_team_summaries/payment_support_team_summaries.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationRepository,
      OrganizationDivisionType,
      OrganizationType,
      Region,
      FinancialInstitution,
      PaymentSupportTeamSummaryRepository,
      PaymentOrganizationSummaryRepository,
      PaymentTeamSummaryRepository,
    ]),
    LoggerModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, FilesService, FinancialInstitutionsService],
})
export class OrganizationsModule {}
