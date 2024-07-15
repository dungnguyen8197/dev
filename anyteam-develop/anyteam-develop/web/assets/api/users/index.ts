import apiMethod from '../helpers/apiMethod';
import { apiRequest } from '../helpers/apiRequest';

export const userConfirmationEmail = async (form: any) => {
  const url = `/api/users/confirmation/email`;
  return await apiRequest(url, apiMethod.post, form);
};

export const userRegister = async (form: any) => {
  const url = `/api/users/register`;
  return await apiRequest(url, apiMethod.post, form);
};

export const updateUser = async (form: FormData): Promise<void> => {
  const url = `/api/user/profile`;
  return await apiRequest(url, apiMethod.post, form, true);
};

export const changePassword = async (form: any) => {
  const url = `/api/user/change-password`;
  return await apiRequest(url, apiMethod.patch, form, true);
};

export const emailChangeCode = async (form: any) => {
  const url = `/api/user/email`;
  return await apiRequest(url, apiMethod.post, form);
};

export const emailVerifyCode = async (form: any) => {
  const url = `/api/user/email/verify`;
  return await apiRequest(url, apiMethod.patch, form);
};

export const userLogout = async (): Promise<void> => {
  const url = '/api/user/logout';
  return await apiRequest(url, apiMethod.post);
};
