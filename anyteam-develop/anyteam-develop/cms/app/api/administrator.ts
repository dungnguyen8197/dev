import {
  AdminListRO,
  AdministratorDetailDTO,
  SearchAdministratorQuery,
} from '~/interfaces/admins.interface';

import apiMethod from '~/api/common/apiMethod';
import { apiRequest } from '~/api/common/apiRequest';

export const getAdministratorList = (query: SearchAdministratorQuery): Promise<AdminListRO> => {
  const url = '/api/v1/admin/administrators';
  return apiRequest(url, apiMethod.get, {}, false, query);
}

export const deleteAdministratorById = (id: number): Promise<void> => {
  const url = `/api/v1/admin/administrators/${id}`;
  return apiRequest(url, apiMethod.delete);
}

export const createAdministrator = (data: AdministratorDetailDTO): Promise<void> => {
  const url = '/api/v1/admin/administrators';
  return apiRequest(url, apiMethod.post, data);
}

export const getAdministratorDetail = (id: number): Promise<AdministratorDetailDTO> => {
  const url = `/api/v1/admin/administrators/${id}`;
  return apiRequest(url, apiMethod.get);
}

export const updateAdministrator = (id: number, administrator: AdministratorDetailDTO): Promise<void> => {
  const data = { ...administrator };

  const url = `/api/v1/admin/administrators/${id}`;
  return apiRequest(url, apiMethod.put, data);
}
