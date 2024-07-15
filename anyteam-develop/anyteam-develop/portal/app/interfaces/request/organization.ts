export interface OrganizationRequest {
  email: string;
  region_id: number;
  municipalities: string;
  address: string;
  building_name: string;
  telephone_number: string;
  bank_code: string;
  branch_code: string;
  account_type_id: string;
  account_number: string;
  account_holder: string;
  icon?: File;
}
