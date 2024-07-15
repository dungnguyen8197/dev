import { MiddlewareConsumer, Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { EmailService } from './email/email.service';
import { FinancialInstitutionsModule } from './financial-institutions/financial-institutions.module';
import { GmoModule } from './gmo/gmo.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrganizationDivisionTypesModule } from './organization-division-types/organization-division-types.module';
import { OrganizationTeamsModule } from './organization-teams/organization-teams.module';
import { OrganizationUsersModule } from './organization-users/organization-users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PaymentOrganizationSummariesModule } from './payment-organization-summaries/payment-organization-summaries.module';
import { PaymentSummariesModule } from './payment-summaries/payment-summaries.module';
import { PaymentSupportOrganizationSummariesModule } from './payment-support-organization-summaries/payment-support-organization-summaries.module';
import { PaymentSupportTeamSummariesModule } from './payment-support-team-summaries/payment-support-team-summaries.module';
import { PaymentTeamSummariesModule } from './payment-team-summaries/payment-team-summaries.module';
import { PurchasesModule } from './purchases/purchases.module';
import { RegionsModule } from './regions/regions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
import { TeamsModule } from './teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEmailUpdateTransactionsModule } from './user-email-update-transactions/user-email-update-transactions.module';
import { UserRegisterTransactionModule } from './user-register-transactions/user-register-transactions.module';
import { UsersModule } from './users/users.module';
import { PaymentCompetitionSummariesModule } from './payment-competition-summaries/payment-competition-summaries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(),
    TeamsModule,
    AdminModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
    LoggerModule,
    UserRegisterTransactionModule,
    RegionsModule,
    OrganizationsModule,
    CompetitionsModule,
    OrganizationUsersModule,
    OrganizationTeamsModule,
    OrganizationDivisionTypesModule,
    UserEmailUpdateTransactionsModule,
    PurchasesModule,
    ContactModule,
    ScheduleModule.forRoot(),
    GmoModule,
    FinancialInstitutionsModule,
    PaymentSummariesModule,
    PaymentOrganizationSummariesModule,
    PaymentSupportTeamSummariesModule,
    PaymentSupportOrganizationSummariesModule,
    PaymentTeamSummariesModule,
    PaymentCompetitionSummariesModule,
  ],
  providers: [EmailService, TasksService],
  controllers: [HealthCheckController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
