import {apiRequest} from "~/api/helpers/apiRequest";
import apiMethod from "~/api/helpers/apiMethod";
import { CompetitionsResponse } from '~/interfaces/response/competitions';

export const getCompetitions = (): Promise<CompetitionsResponse> => {
  return apiRequest('/api/v1/competitions', apiMethod.get);
}
