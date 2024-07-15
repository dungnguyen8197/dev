import { Region, RegionGroup } from '../types/region';

export const getRegionsFromGroups = (groups: RegionGroup[]): Region[] => { 
  return groups.reduce((regions: Region[], group) => {
    return [...regions, ...group.list];
  }, []);
}
