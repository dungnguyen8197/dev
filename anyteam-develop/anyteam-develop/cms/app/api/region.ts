import { apiRequest } from '~/api/common/apiRequest';
import apiMethod from '~/api/common/apiMethod';
import { RegionGroupsRO } from '~/interfaces/region.interface';

export const getRegionGroups = (): Promise<RegionGroupsRO> => {
  const url = `/api/v1/regions`;
  return apiRequest(url, apiMethod.get);
}
