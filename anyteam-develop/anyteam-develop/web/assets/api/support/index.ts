import { GMOUpdateRequest } from '../../types/gmo';
import { SupportInfo } from '../../types/support/info';
import apiMethod from '../helpers/apiMethod';
import { apiRequest } from '../helpers/apiRequest';

export const registerSupport = (formData: SupportInfo): Promise<void> => {
  const url = '/api/support';
  return apiRequest(url, apiMethod.post, formData);
}

export const executeSupport = (): Promise<{ purchase_id: string }> => {
  const url = '/api/support/execute';
  return apiRequest(url, apiMethod.post);
}

export const updateWallet = (wallet: GMOUpdateRequest): Promise<any> => {
  const url = '/api/support/wallet';
  return apiRequest(url, apiMethod.patch, wallet);
}