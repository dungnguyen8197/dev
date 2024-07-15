import { Region, RegionGroup } from '~/interfaces/region.interface';
import { SelectOption } from '~/interfaces/select-option';

export const getRegionsFromGroups = (groups: RegionGroup[]): Region[] => {
  return groups.reduce((regions: Region[], group) => {
    return [...regions, ...group.list];
  }, []);
}

export const regionsToSelectOptions = (regions: Region[]): SelectOption[] => {
  return regions.map(region => ({
    value: region.id,
    label: region.name,
  }));
}

export const regionResponseToSelectOptions = (groups: RegionGroup[]): SelectOption[] => {
  const regions = getRegionsFromGroups(groups);
  return regionsToSelectOptions(regions);
}
