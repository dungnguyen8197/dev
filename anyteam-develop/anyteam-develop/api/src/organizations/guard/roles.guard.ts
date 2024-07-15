
import { Injectable, ExecutionContext, CanActivate, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/entity/organization.entity';
import {  Repository } from "typeorm"; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>
    ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const myOrganizationId = request.user.organizationId;
    const organizationId = Number(request.params.organization_id)

    if (myOrganizationId === organizationId) {
      return true;
    }

    const matchRoles = await this.matchRoles(myOrganizationId, organizationId)

    if (!matchRoles) {
      throw new ForbiddenException();
    }
    return true;
  }

  async matchRoles(myOrganizationId, organizationId) {
    const groupUser = await this.organizationsRepository.findOne(myOrganizationId);

    if (groupUser && groupUser.is_group) {
      const organization = await this.organizationsRepository.findOne(organizationId);

      if (!organization) {
        throw new BadRequestException();
      }
      
      if (groupUser.division_type_id === organization.division_type_id) {
        return true
      }
    }

    return false;
  }
}
