export interface OrganizationRO {
  id: number;
  name: string;
  region_id: number;
  name_line_id: number;
  division_type_id: number;
  email: string;
  municipalities: string;
  address: string;
  building_name: string;
  telephone_number: string;
  bank_code: string;
  branch_code: string;
  account_type_id: number;
  account_number: string;
  account_holder: string;
  icon: string;
  status: number;
  is_group: boolean;
}

export interface OrganizationListRO {
  total: number;
  list : {
    id: number;
    name: string;
    type_name: string;
    division_type_name: string;
    created_at: string;
  }[];
}

export interface SearchOrganizationQuery {
  name?: string;
  offset?: number;
  limit?: number;
}

export interface OrganizationDTO {
  id: number;
  name: string;
  region_id: number;
  name_line_id: number;
  division_type_id: number;
  email: string;
  municipalities: string;
  address: string;
  building_name: string;
  telephone_number: string;
  bank_code: string;
  branch_code: string;
  account_type_id: number;
  account_number: string;
  account_holder: string;
  icon?: string;
  iconBlob?: File | null;
  status: number;
  is_group: boolean;
}

export interface OrganizationIconRO {
  icon: string;
}
