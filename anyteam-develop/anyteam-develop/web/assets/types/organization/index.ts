export interface OrganizationResponse {
  organization: OrganizationObject;
  organizationActivities: OrganizationActivitiesObject;
}
export interface OrganizationObject {
  id: number;
  name: '';
  region_name: '';
  division_type_name: '';
}
export interface OrganizationActivitiesObject {
  list: ClubActivitiesObject[];
}

export interface ClubActivitiesObject {
  id: number;
  name: '';
}
