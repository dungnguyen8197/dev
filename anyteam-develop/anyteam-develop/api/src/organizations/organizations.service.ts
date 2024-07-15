import { CustomLogger } from '../logger/logger.service';
import { PaymentTeamSummaryRepository } from './../payment-team-summaries/payment-team-summaries.repository';
import { PaymentOrganizationSummaryRepository } from 'src/payment-organization-summaries/payment-organization-summaries.repository';
import {
  GetOrganizationSupportRequest,
  GetOrganizationTotalSupportRequest,
  GetTeamSupportRequest,
  GetTeamTotalSupportRequest,
} from './dto/organization-support.dto';
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import * as sharp from 'sharp';
import { OrganizationEntity } from 'src/domain/entity/organization';
import { OrganizationDivisionTypeEntity } from 'src/domain/entity/organization-division-type';
import { OrganizationDetailResponse } from 'src/organizations/dto/organization-detail.dto';
import { OrganizationList } from 'src/domain/entity/organizations/list';
import { OrganizationType } from 'src/entity/organization-type.entity';
import { FilesService } from 'src/files/files.service';
import { FinancialInstitutionsService } from 'src/financial-institutions/financial-institutions.service';
import { OrganizationDivisionTypeList } from '../domain/entity/organization-division-type/list';
import { AdminOrganizationList } from '../domain/entity/administrator/organization/list';
import { AdminOrganizationEntity } from '../domain/entity/administrator/organization/entity';
import { Organization } from '../entity/organization.entity';
import { GetOrganizationInfoResponse } from './dto/organization-info.dto';
import { OrganizationUpdateRequest } from './dto/organizations-update.dto';
import { GetOrganizationsQuery } from './dto/organizations.dto';
import { OrganizationRepository } from './organizations.repository';
import { OrganizationIconVo } from 'src/domain/value-object/organization/icon';
import {
  AdminGetOrganizationsQuery,
  AdminOrganizationDTO,
} from './dto/organization-admin.dto';
import { OrganizationIconEntity } from 'src/domain/entity/organizations/icon';
import { AdminOrganizationDetailEntity } from '../domain/entity/administrator/organization/detail';
import { FindFinancialInstitutionResponse } from 'src/financial-institutions/dto/find.dto';
import { GetOrganizationSupportersRequest } from './dto/organization-supporters.dto';
import { PaymentSupportTeamSummaryRepository } from '../payment_support_team_summaries/payment_support_team_summaries.repository';
import { SupporterList } from 'src/domain/entity/organizations/supporter-list';
import { Supporter } from 'src/domain/entity/organizations/supporter';
import { TotalSupport as TeamTotalSupport } from '../domain/entity/team/total-support';
import { SupportList as TeamSupportList } from '../domain/entity/team/support-list';
import { Support as TeamSupport } from 'src/domain/entity/team/support';
import { TotalSupport as OrganizationTotalSupport } from '../domain/entity/organizations/total-support';
import { SupportList as OrganizationSupportList } from '../domain/entity/organizations/support-list';
import { Support as OrganizationSupport } from 'src/domain/entity/organizations/support';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationType)
    private readonly organizationTypesRepository: Repository<OrganizationType>,
    private readonly filesService: FilesService,
    private readonly financialInstitutionsService: FinancialInstitutionsService,
    private connection: Connection,
    private readonly organizationsRepository: OrganizationRepository,
    private readonly paymentSupportTeamSummaryRepository: PaymentSupportTeamSummaryRepository,
    private readonly paymentOrganizationSummaryRepository: PaymentOrganizationSummaryRepository,
    private readonly paymentTeamSummaryRepository: PaymentTeamSummaryRepository,
    private logger: CustomLogger,
  ) {}

  async getListDivisionByType(type_id: string): Promise<any> {
    const organizationType = await this.organizationTypesRepository.findOne(
      type_id,
      { relations: ['organization_division_types'] },
    );

    if (!organizationType) {
      throw new BadRequestException();
    }

    const organizationDivisionTypes =
      organizationType.organization_division_types.map(
        (organizationDivisionType) => {
          return new OrganizationDivisionTypeEntity(
            organizationDivisionType.id,
            organizationDivisionType.name,
          );
        },
      );

    return new OrganizationDivisionTypeList(organizationDivisionTypes);
  }

  async getList(req: GetOrganizationsQuery): Promise<OrganizationList> {
    const { organizations, total } =
      await this.organizationsRepository.getListOrganization(req);

    const organizationEntityList = organizations.map((organization) => {
      return new OrganizationEntity(
        organization.id,
        organization.name,
        organization.icon,
        organization.region.id,
        organization.region.name,
      );
    });

    return new OrganizationList(organizationEntityList, total);
  }

  async getDetailOrganization(
    organization_id: number,
  ): Promise<OrganizationDetailResponse> {
    const organization = await this.organizationsRepository.findOne(
      organization_id,
      { relations: ['organization_division_type', 'region'] },
    );

    if (!organization) {
      throw new BadRequestException();
    }

    let financialInstitution: FindFinancialInstitutionResponse = {
      name: '',
      name_kana: '',
      shop_name: '',
      shop_name_kana: '',
    };
    try {
      financialInstitution = await this.financialInstitutionsService.findByCode(
        {
          code: organization.bank_code,
          shop_code: organization.branch_code,
        },
      );
    } catch (err) {}

    const organizationIconUrl = this.getIcon(organization.icon);

    return new OrganizationDetailResponse(
      organization,
      organizationIconUrl,
      financialInstitution,
    );
  }

  async getOrganization(
    organization_id: number,
  ): Promise<GetOrganizationInfoResponse> {
    const organization = await this.organizationsRepository.findOne(
      organization_id,
      { relations: ['organization_division_type', 'region'] },
    );

    return new GetOrganizationInfoResponse(
      organization.id,
      organization.region_id,
      organization.region.name,
      organization.division_type_id,
      organization.organization_division_type.name,
      organization.name,
    );
  }

  async update(
    organization_id: number,
    req: OrganizationUpdateRequest,
    reqIcon: Express.Multer.File | null,
  ): Promise<void> {
    try {
      const organization = await this.organizationsRepository.findOne(
        organization_id,
      );
      if (!organization) {
        throw new BadRequestException();
      }

      const currentOrganizationUser = await this.findByEmail(req.email);
      if (
        currentOrganizationUser &&
        currentOrganizationUser.id !== organization_id
      ) {
        throw new ConflictException({
          message_type: 'error',
          error: { email: 'メールアドレス使用済み' },
        });
      }
      const newIcon = reqIcon ? (await this.uploadIcon(reqIcon)).icon : '';
      if (reqIcon && organization.icon) {
        const icon = new OrganizationIconVo(organization.icon);
        const directoryPath = icon.getDirectory();
        await this.filesService.deleteFileS3(organization.icon, directoryPath);
      }
      await this.organizationsRepository.updateOrganization(
        organization_id,
        req,
        newIcon,
      );

      return;
    } catch (err) {
      throw err;
    }
  }

  getIcon(icon: string): string {
    const organizationIcon = new OrganizationIconVo(icon);
    return organizationIcon.getUrl();
  }

  async uploadIcon(icon: Express.Multer.File): Promise<OrganizationIconEntity> {
    const organizationIcon = new OrganizationIconVo(icon.originalname);
    const directoryPath = organizationIcon.getDirectory();
    const resizeIcon = await sharp(icon.buffer).resize(100, 100).toBuffer();
    const contentType = icon.mimetype;
    try {
      const uploadedIcon = await this.filesService.uploadPublicFile(
        resizeIcon,
        icon.originalname,
        directoryPath,
        contentType,
      );
      return new OrganizationIconEntity(uploadedIcon);
    } catch (err) {
      throw err;
    }
  }

  // Find organization by email
  findByEmail(email: Organization['email']): Promise<Organization | undefined> {
    return this.organizationsRepository.findOne({ where: { email } });
  }

  async validateUniqueEmail(
    email: string,
    organization_id: number | null = null,
  ): Promise<void> {
    const organization = await this.findByEmail(email);
    if (
      organization &&
      (!organization_id || organization_id !== organization.id)
    ) {
      throw new ConflictException({
        message_type: 'error',
        error: { email: 'メールアドレス使用済み' },
      });
    }
  }

  // Admin
  async adminGetList(
    req: AdminGetOrganizationsQuery,
  ): Promise<AdminOrganizationList> {
    const { organizations, total } =
      await this.organizationsRepository.adminGetList(req);

    const organizationEntityList = organizations.map((organization) => {
      return new AdminOrganizationEntity(
        organization,
        organization.organization_division_type.organization_type.name,
        organization.organization_division_type.name,
      );
    });

    return new AdminOrganizationList(organizationEntityList, total);
  }

  async adminCreate(req: AdminOrganizationDTO): Promise<void> {
    if (req.email) await this.validateUniqueEmail(req.email);

    try {
      const organization = this.organizationsRepository.create(req);
      await this.organizationsRepository.save(organization);
    } catch (err) {
      if (err.status === 409) throw err;
      throw new BadRequestException();
    }
  }

  async adminFindOne(id: number): Promise<AdminOrganizationDetailEntity> {
    const organization = await this.organizationsRepository.findOne(id);
    if (!organization) {
      throw new BadRequestException();
    }

    const organizationIconUrl = this.getIcon(organization.icon);
    return new AdminOrganizationDetailEntity(organization, organizationIconUrl);
  }

  async adminUpdate(id: number, req: AdminOrganizationDTO): Promise<void> {
    try {
      const organization = await this.organizationsRepository.findOne(id);
      if (!organization) {
        throw new BadRequestException();
      }

      if (req.email) await this.validateUniqueEmail(req.email, id);

      if (req.icon && organization.icon && req.icon !== organization.icon) {
        const icon = new OrganizationIconVo(organization.icon);
        const directoryPath = icon.getDirectory();
        await this.filesService.deleteFileS3(organization.icon, directoryPath);
      }
      if (!req.icon) delete req.icon;

      await this.organizationsRepository.update(id, req);
    } catch (err) {
      if (err.status === 409) throw err;
      throw new BadRequestException();
    }
  }

  async adminDelete(organization_id: number): Promise<void> {
    try {
      const organization = await this.organizationsRepository.findOne(
        organization_id,
      );
      if (!organization) {
        throw new BadRequestException();
      }

      await this.organizationsRepository.delete(organization_id);

      return;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async getSupporters(
    req: GetOrganizationSupportersRequest,
    organizationId: number,
  ): Promise<SupporterList> {
    const { organizationSupporters, total } =
      await this.paymentSupportTeamSummaryRepository.getSupporterList(
        req,
        organizationId,
      );
    const organizationUserEntityList = await Promise.all(
      organizationSupporters.map(async (supporter) => {
        return new Supporter(
          supporter['user_id'],
          supporter['user_firstname'],
          supporter['user_lastname'],
          supporter['birthday'],
          supporter['thumbnail'],
          supporter['region_id'],
          supporter['region_name'],
          supporter['teams'],
        );
      }),
    );

    return new SupporterList(organizationUserEntityList, total);
  }

  async getTeamSupportTotal(
    organization_id: number,
    req: GetTeamTotalSupportRequest,
  ): Promise<TeamTotalSupport> {
    try {
      const organization = await this.organizationsRepository.findOne(
        organization_id,
      );
      if (!organization) {
        throw new BadRequestException();
      }

      const totalAmount =
        await this.paymentTeamSummaryRepository.getTeamSupportTotal(
          organization_id,
          req,
        );
      return new TeamTotalSupport(parseInt(totalAmount));
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getTeamSupports(
    organization_id: number,
    req: GetTeamSupportRequest,
  ): Promise<TeamSupportList> {
    try {
      const organization = await this.organizationsRepository.findOne(
        organization_id,
      );
      if (!organization) {
        throw new BadRequestException();
      }

      const { paymentTeamSummaries, total } =
        await this.paymentTeamSummaryRepository.getTeamSupports(
          organization_id,
          req,
        );

      const paymentTeamSummaryList = paymentTeamSummaries.map((paymentTeam) => {
        return new TeamSupport(
          paymentTeam.team.id,
          paymentTeam.team.name,
          paymentTeam.amount,
          paymentTeam.general_support_count,
          paymentTeam.general_support_amount,
          paymentTeam.subscription_support_count,
          paymentTeam.subscription_support_amount,
        );
      });

      return new TeamSupportList(paymentTeamSummaryList, total);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getOrganizationSupportTotal(
    req: GetOrganizationTotalSupportRequest,
  ): Promise<OrganizationTotalSupport> {
    try {
      const { organizationCount, amount } =
        await this.paymentOrganizationSummaryRepository.getOrganizationSupportTotal(
          req,
        );
      return new OrganizationTotalSupport(organizationCount, amount);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getOrganizationSupports(
    req: GetOrganizationSupportRequest,
  ): Promise<OrganizationSupportList> {
    try {
      const { paymentOrganizationSummary, total } =
        await this.paymentOrganizationSummaryRepository.getOrganizationSupports(
          req,
        );

      const paymentTeamSummaryList = paymentOrganizationSummary.map(
        (paymentOrganization) => {
          return new OrganizationSupport(
            paymentOrganization.organization.id,
            paymentOrganization.organization.name,
            paymentOrganization.organization.region.id,
            paymentOrganization.organization.region.name,
            paymentOrganization.organization.organization_teams.length,
            paymentOrganization.amount,
            paymentOrganization.general_support_count,
            paymentOrganization.general_support_amount,
            paymentOrganization.subscription_support_count,
            paymentOrganization.subscription_support_amount,
          );
        },
      );

      return new OrganizationSupportList(paymentTeamSummaryList, total);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
