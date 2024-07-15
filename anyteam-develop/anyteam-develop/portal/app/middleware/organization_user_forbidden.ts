import { Middleware } from '@nuxt/types';
import { ADMIN_ROLE } from '~/constants/organization_user';

const organizationUserForbidden: Middleware = ({$auth, params, error}) => {
  const routeOrganizationId = +params.organization_id as number;
  const authOrganizationId = $auth.user!.organization_id as number;
  const routeUserId = +params.organization_user_id as number;
  const authUserId = $auth.user!.id as number;
  const roleUser = $auth.user!.role as number

  if (
    (routeOrganizationId && authOrganizationId && routeOrganizationId !== authOrganizationId) ||
    (routeUserId && authUserId && routeUserId !== authUserId && roleUser !== ADMIN_ROLE)
  ) {
      error({statusCode: 403, message: 'Forbidden'});
  }
}

export default organizationUserForbidden;