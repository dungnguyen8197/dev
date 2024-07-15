export interface OrganizationUser {
    id: number;
    name: string;
    email: string;
    role: number;
    role_label: string;
}

export interface OrganizationUsers {
    list: OrganizationUser[];
}