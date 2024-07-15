import axios, { AxiosResponse } from 'axios';

import { OrganizationTeamListResponse, TeamDetailResponse } from '../assets/types/organization/team';
import { OrganizationObject } from '../assets/types/organization/index';
import { UserProfileRO } from '../assets/types/user/profile';
import { PurchaseCreateRequest, PurchaseCreateResponse, PurchaseResponse } from './../assets/types/purchase';
import { apiRequest } from '../assets/api/helpers/apiRequest';
import apiMethod from '../assets/api/helpers/apiMethod';

const env = process.env;

export const getUserProfile = (token: string): Promise<AxiosResponse<UserProfileRO>> => {
  return axios.get(env.API_ROOT + '/api/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getTeamDetail = (
  team_id: number,
  token: string
): Promise<AxiosResponse<TeamDetailResponse>> => {
  return axios.get(env.API_ROOT + `/api/v1/teams/${team_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getListOrganizationTeams = (
  organization_id: number,
  token: string
): Promise<AxiosResponse<OrganizationTeamListResponse>> => {
  return axios.get(env.API_ROOT + `/api/v1/organizations/${organization_id}/teams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getOrganizationInformation = (
  organization_id: number
): Promise<AxiosResponse<OrganizationObject>> => {
  const url = `${env.API_ROOT}/api/v1/organizations/${organization_id}/information`;
  return axios.get(url);
}

export const createPurchase = (
  purchaseRequest: PurchaseCreateRequest,
  token: string,
): Promise<PurchaseCreateResponse> => {
  const url = env.API_ROOT + '/api/v1/purchases';
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return apiRequest(url, apiMethod.post, purchaseRequest);
}

export const getPurchaseDetail = (
  purchase_id: number,
  token: string
): Promise<AxiosResponse<PurchaseResponse>> => {
  const url = `${env.API_ROOT}/api/v1/purchases/${purchase_id}`;
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
