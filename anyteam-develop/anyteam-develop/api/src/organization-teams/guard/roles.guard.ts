import { Injectable, ExecutionContext, CanActivate, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class RoleUpdateGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const myOrganizationId = request.user.organizationId;
    const organizationId = Number(request.params.organization_id)

    if (myOrganizationId === organizationId) {
      return true;
    }

    throw new ForbiddenException();
  }
}