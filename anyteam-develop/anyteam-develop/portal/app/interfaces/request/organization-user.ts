export interface OrganizationUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateOrganizationUserRequest {
  email: string;
  role: number;
}
