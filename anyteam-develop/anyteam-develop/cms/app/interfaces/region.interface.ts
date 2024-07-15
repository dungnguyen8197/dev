export interface Region {
  name: string;
  id: number;
}

export interface RegionGroup {
  region_group_id: number;
  name: string;
  list: Region[];
}

export interface RegionGroupsRO {
  groups: RegionGroup[];
}
