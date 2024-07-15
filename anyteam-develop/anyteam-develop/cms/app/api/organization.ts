import {
  OrganizationDTO,
  OrganizationIconRO,
  OrganizationListRO,
  OrganizationRO,
  SearchOrganizationQuery,
} from '~/interfaces/organization.interface';
import { apiRequest } from '~/api/common/apiRequest';
import apiMethod from '~/api/common/apiMethod';

export const getOrganizationList = (query: SearchOrganizationQuery): Promise<OrganizationListRO> => {
  const url = '/api/v1/admin/organizations';
  return apiRequest(url, apiMethod.get, {}, false, query);
}

export const deleteOrganizationById = (id: number): Promise<void> => {
  const url = `/api/v1/admin/organizations/${id}`;
  return apiRequest(url, apiMethod.delete);
}

export const uploadOrganizationIcon = (icon: File): Promise<OrganizationIconRO> => {
  const url = '/api/v1/admin/organizations/icons';
  const formData = new FormData();
  formData.append('icon', icon);

  return apiRequest(url, apiMethod.post, formData, true);
}

export const createOrganization = (data: OrganizationDTO): Promise<void> => {
  const url = '/api/v1/admin/organizations';
  return apiRequest(url, apiMethod.post, data);
}

export const getOrganizationDetail = (id: number): Promise<OrganizationRO> => {
  const url = `/api/v1/admin/organizations/${id}`;
  return apiRequest(url, apiMethod.get);
}

export const updateOrganization = (id: number, organization: OrganizationDTO): Promise<void> => {
  const data = { ...organization };
  if (!data.iconBlob) data.icon = '';
  delete data.iconBlob;

  const url = `/api/v1/admin/organizations/${id}`;
  return apiRequest(url, apiMethod.put, data);
}
