import { EntityRepository, Repository, getConnection } from 'typeorm';

import { AdminGetOrganizationsQuery } from './dto/organization-admin.dto';
import { GetOrganizationsQuery } from './dto/organizations.dto';
import { Organization } from 'src/entity/organization.entity';
import { OrganizationUpdateRequest } from './dto/organizations-update.dto';
import {
  OrganizationStatusVo,
  ORGANIZATION_STATUS_ACTIVE,
} from 'src/domain/value-object/organization/status';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  async getListOrganization(
    query: GetOrganizationsQuery,
  ): Promise<{ organizations: Organization[]; total: number }> {
    const conditionQuery = this.createQueryBuilder(
      'organizations',
    ).leftJoinAndSelect('organizations.region', 'region');

    if (query.organization_type) {
      conditionQuery.leftJoinAndSelect(
        'organizations.organization_division_type',
        'organization_division_types',
      );
      conditionQuery.andWhere(
        'organization_division_types.organization_type_id = :organizationType',
        { organizationType: query.organization_type },
      );
    }

    if (query.name) {
      conditionQuery.andWhere('organizations.name like :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.region_id) {
      conditionQuery.andWhere('organizations.region_id = :regionId', {
        regionId: query.region_id,
      });
    }

    if (query.name_line_id) {
      conditionQuery.andWhere('organizations.name_line_id = :nameLineId', {
        nameLineId: query.name_line_id,
      });
    }

    if (!query.scope || query.scope !== 'all') {
      conditionQuery.andWhere('organizations.status != :status', {
        status: 0,
      });
    }

    const total = await conditionQuery.getCount();

    const organizationRepository = await conditionQuery
      .skip(query.offset || 0) // offset default 0
      .take(query.limit || null) // limit default all
      .orderBy('organizations.id') // order by id ASC
      .getMany();

    return {
      organizations: organizationRepository,
      total: total,
    };
  }

  async updateOrganization(
    organization_id: number,
    req: OrganizationUpdateRequest,
    icon: string,
  ): Promise<Organization> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const organizationStatusVo = new OrganizationStatusVo(
      ORGANIZATION_STATUS_ACTIVE,
    );

    try {
      const organizationEntity = new Organization();
      organizationEntity.region_id = req.region_id;
      organizationEntity.email = req.email;
      organizationEntity.postal_code = req.postal_code;
      organizationEntity.municipalities = req.municipalities;
      organizationEntity.address = req.address;
      organizationEntity.building_name = req.building_name;
      organizationEntity.telephone_number = req.telephone_number;
      organizationEntity.bank_code = req.bank_code;
      organizationEntity.branch_code = req.branch_code;
      organizationEntity.account_type_id = req.account_type_id;
      organizationEntity.account_number = req.account_number;
      organizationEntity.account_holder = req.account_holder;
      organizationEntity.status = organizationStatusVo.getValue();
      if (icon) organizationEntity.icon = icon;

      await queryRunner.manager.update(
        Organization,
        organization_id,
        organizationEntity,
      );
      await queryRunner.commitTransaction();

      return organizationEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async adminGetList(
    req: AdminGetOrganizationsQuery,
  ): Promise<{ organizations: Organization[]; total: number }> {
    const conditionQuery = this.createQueryBuilder('organization')
      .leftJoinAndSelect(
        'organization.organization_division_type',
        'division_type',
      )
      .leftJoinAndSelect('division_type.organization_type', 'type');

    if (req.name) {
      conditionQuery.andWhere('organization.name like :name', {
        name: `%${req.name}%`,
      });
      conditionQuery.orWhere('division_type.name like :division_type_name', {
        division_type_name: `%${req.name}%`,
      });
      conditionQuery.orWhere('type.name like :type_name', {
        type_name: `%${req.name}%`,
      });

      if (req.name.includes('/ 団体') || '/ 団体'.includes(req.name)) {
        conditionQuery.orWhere('organization.is_group = :is_group', {
          is_group: true,
        });
      }
    }

    const total = await conditionQuery.getCount();

    const organizationRepository = await conditionQuery
      .skip(req.offset || 0)
      .take(req.limit || null)
      .orderBy('organization.id')
      .getMany();

    return {
      organizations: organizationRepository,
      total,
    };
  }
}
