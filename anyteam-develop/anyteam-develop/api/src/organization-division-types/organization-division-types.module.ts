import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationDivisionType } from 'src/entity/organization-division-type.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { OrganizationDivisionTypesController } from './organization-division-types.controller';
import { OrganizationDivisionTypesService } from './organization-division-types.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationDivisionType]),
    LoggerModule
  ],
  controllers: [OrganizationDivisionTypesController],
  providers: [OrganizationDivisionTypesService]
})
export class OrganizationDivisionTypesModule {}
