import { FinancialResponse } from './financial';

export interface OrganizationResponse {
  id: number;
  name: string;
  postal_code: string;
  region_id: number | string;
  region_name: string;
  email: string;
  municipalities: string;
  address: string;
  building_name: string;
  telephone_number: string;
  bank_code: string;
  branch_code: string;
  financial_institution?: FinancialResponse;
  account_type_id: number;
  account_number: string;
  account_holder: string;
  icon: string;
  status: number;
}

export interface OrganizationsPaginateItem {
  id: number;
  name: string;
  icon: string;
  region_id: number;
  region_name: string;
}

export interface OrganizationsPaginate {
  list: OrganizationsPaginateItem[];
  total: number;
}
