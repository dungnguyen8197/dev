import {
  Injectable,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard extends AuthGuard('jwt-organization-user') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const organizationUserId = request.user.organizationId;
    const organizationId = Number(request.params.organization_id);

    if (!organizationId) {
      throw new BadRequestException();
    } else if (organizationUserId !== organizationId) {
      throw new ForbiddenException();
    }

    return true;
  }
}
