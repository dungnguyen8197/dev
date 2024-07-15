import {apiRequest} from "~/api/helpers/apiRequest";
import apiMethod from "~/api/helpers/apiMethod";
import { RegionGroupResponse } from "~/interfaces/response/region";

export const getRegionGroups = (): Promise<RegionGroupResponse> => {
  return apiRequest('/api/v1/regions', apiMethod.get);
}
