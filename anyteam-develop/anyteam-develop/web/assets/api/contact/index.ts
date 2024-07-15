import apiMethod from '../helpers/apiMethod';
import { apiRequest } from '../helpers/apiRequest';

export const contactSendToDev = async (form) => {
  const url = `/api/contact`;
  return await apiRequest(url, apiMethod.post, form);
};
