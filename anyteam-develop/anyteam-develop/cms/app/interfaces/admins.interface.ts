export interface AdminListRO {
  count: number,
  offset: number,
  list: {
    id: number,
    name: string,
    email: string,
  }[]
}

export interface SearchAdministratorQuery {
  search?: string;
  offset?: number;
  limit?: number;
}

export interface AdministratorDetailDTO {
  id?: number;
  name: string;
  email: string;
  password: string;
}
