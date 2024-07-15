export interface Region {
  id: number;
  name: string;
}

export interface RegionGroup {
  region_group_id: number;
  name: string;
  list: Region[];
}

export interface RegionGroupResponse {
  groups: RegionGroup[];
}
