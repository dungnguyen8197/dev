import { apiRequest } from '~/api/helpers/apiRequest';
import apiMethod from '~/api/helpers/apiMethod';
import { CreateOrganizationUserRequest, OrganizationUserRequest } from '~/interfaces/request/organization-user';
import { OrganizationUser, OrganizationUsers } from '~/interfaces/response/organization-users';

export const registerOrganizationUser = (
  organizationId: number,
  organizationUserId: number,
  data: OrganizationUserRequest
): Promise<void> => {
  const url = `/api/v1/organizations/${organizationId}/organization-users/${organizationUserId}`
  return apiRequest(url, apiMethod.patch, data);
}

export const getOrganizationUsers = (organizationId: number): Promise<OrganizationUsers> => {
  const url = `/api/v1/organizations/${organizationId}/organization-users`
  return apiRequest(url, apiMethod.get);
}

export const createOrganizationUser = (
  organizationId: number, 
  data: CreateOrganizationUserRequest
): Promise<void> => {
  const url = `/api/v1/organizations/${organizationId}/organization-users`;
  return apiRequest(url, apiMethod.post, data);
}

export const findOrganizationUser = (
  organizationId: number,
  organizationUserId: number
): Promise<OrganizationUser> => {
  const url = `/api/v1/organizations/${ organizationId }/organization-users/${ organizationUserId }`
  return apiRequest(url, apiMethod.get);
}

export const deleteOrganizationUser = (
  organizationId: number,
  organizationUserId: number
): Promise<void> => {
  const url = `/api/v1/organizations/${ organizationId }/organization-users/${ organizationUserId }`
  return apiRequest(url, apiMethod.delete);
}
