import { apiRequest } from "~/api/helpers/apiRequest";
import apiMethod from "~/api/helpers/apiMethod";
import { OrganizationResponse } from "~/interfaces/response/organization";
import { OrganizationTeamRequest } from "~/interfaces/request/organization-team";
import { OrganizationsSearchTerm } from "~/interfaces/searchTerm";
import { TeamResponse } from '~/interfaces/response/teams';
import { ORGANIZATIONS_PER_PAGE } from "~/constants/pagination";

export const getOrganizationById = (organizationId: number): Promise<OrganizationResponse> => {
  const url = `api/v1/organizations/${organizationId}`;
  return apiRequest(url, apiMethod.get);
}

export const registerOrganization = (organizationId: number, data: FormData) => {
  const url = `api/v1/organizations/${organizationId}`;
  return apiRequest(url, apiMethod.patch, data, true);
}

export const getOrganizationTeams = (
  organizationId: number, params: {}
): Promise<{ list: TeamResponse[] }> => {
  const url = `api/v1/organizations/${organizationId}/teams`;
  return apiRequest(url, apiMethod.get, {}, true, params);
}

export const updateOrganizationTeams = (organizationId: number, data: OrganizationTeamRequest[]) => {
  const url = `api/v1/organizations/${organizationId}/teams`;
  return apiRequest(url, apiMethod.put, data, true);
}

export const deleteOrganizationTeams = (organizationId: number, data: number[]) => {
  const url = `api/v1/organizations/${organizationId}/teams`;
  return apiRequest(url, apiMethod.delete, data, true);
}

export const getOrganizations = (page: number, searchTerm: OrganizationsSearchTerm = {}) => {
  const url = `api/v1/organizations`;
  const limit = ORGANIZATIONS_PER_PAGE;
  const offset = (page - 1) * limit;
  const scope = 'all';
  const params = {
    limit,
    offset,
    scope,
    ...searchTerm
  };

  return apiRequest(url, apiMethod.get, {}, false, params);
}
