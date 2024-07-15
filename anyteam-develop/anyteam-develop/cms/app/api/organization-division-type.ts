import { OrgDivTypeRO } from '~/interfaces/org-div-type.interface';
import { apiRequest } from '~/api/common/apiRequest';
import apiMethod from '~/api/common/apiMethod';

export const getOrganizationDivisionType = (organizationTypeId: number): Promise<OrgDivTypeRO> => {
  const url = `/api/v1/organization-division-types`;
  const params = { 'organization-type': organizationTypeId };
  return apiRequest(url, apiMethod.get, {}, true, params);
}
