import { Middleware } from '@nuxt/types';

const forbidden: Middleware = ({$auth, params, error}) => {
  const routeOrganizationId = +params.organization_id as number;
  const authOrganizationId = $auth.user!.organization_id as number;
  const routeUserId = +params.organization_user_id as number;
  const authUserId = $auth.user!.id as number;

  if (
    (routeOrganizationId && authOrganizationId && routeOrganizationId !== authOrganizationId) ||
    (routeUserId && authUserId && routeUserId !== authUserId)
  ) {
      error({statusCode: 403, message: 'Forbidden'});
  }
}

export default forbidden;