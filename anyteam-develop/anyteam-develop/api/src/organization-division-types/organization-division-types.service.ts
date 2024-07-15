import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDivisionTypeEntity } from 'src/domain/entity/organization-division-type';
import { OrganizationDivisionTypeList } from 'src/domain/entity/organization-division-type/list';
import { OrganizationDivisionType } from 'src/entity/organization-division-type.entity';
import { CustomLogger } from 'src/logger/logger.service';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationDivisionTypesService {
  constructor(
    @InjectRepository(OrganizationDivisionType)
    private organizationDivisionTypeRepository: Repository<OrganizationDivisionType>,
    private logger: CustomLogger
  ) {}
  
  async getList(organization_type: number): Promise<OrganizationDivisionTypeList> {
    try {
      const organizationUserEntityList = (await this.findAllByOrganizationType(organization_type)).map(organizationDivisionType => {
        return new OrganizationDivisionTypeEntity(organizationDivisionType.id, organizationDivisionType.name)
      });
      return new OrganizationDivisionTypeList(organizationUserEntityList);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  // find all organization division type by organization type
  findAllByOrganizationType(organization_type: number): Promise<OrganizationDivisionType[]> {
    const conditionQuery = {};

    if (organization_type) {
      conditionQuery['organization_type_id'] = organization_type
    }
    return this.organizationDivisionTypeRepository.find({
      where: conditionQuery,
      select: ['id', 'name', 'organization_type_id'],
      order: { 'id' : 'ASC' }
    });
  }
}
