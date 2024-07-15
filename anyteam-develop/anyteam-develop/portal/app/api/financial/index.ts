import { apiRequest } from '~/api/helpers/apiRequest';
import apiMethod from '~/api/helpers/apiMethod';
import { FinancialRequest } from '~/interfaces/request/financial';
import { FinancialResponse } from '~/interfaces/response/financial';

export const getFinancialName = (req: FinancialRequest): Promise<FinancialResponse> => {
  const url = '/api/v1/financial-institutions';
  return apiRequest(url, apiMethod.get, {}, false, req);
}