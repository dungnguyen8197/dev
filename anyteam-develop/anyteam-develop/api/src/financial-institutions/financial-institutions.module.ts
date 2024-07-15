import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialInstitution } from 'src/entity/financial_institution.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { FinancialInstitutionsController } from './financial-institutions.controller';
import { FinancialInstitutionsService } from './financial-institutions.service';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([FinancialInstitution])],
  controllers: [FinancialInstitutionsController],
  providers: [FinancialInstitutionsService],
})
export class FinancialInstitutionsModule {}
