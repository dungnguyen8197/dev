export interface OrganizationTeam {
  id: number;
  status: number;
  name: string,
  competition_id: number;
}

export interface OrganizationTeamListResponse {
  list: OrganizationTeam[];
}

export interface TeamDetailResponse {
  id: number;
  name: string;
  status: number;
  region_id: number;
  region_name: string;
  division_type_id: number;
  division_type_name: string;
  organization_id: number;
  organization_name: string;
  competition_id: number;
  competition_name: string;
  supporter_count: number;
}