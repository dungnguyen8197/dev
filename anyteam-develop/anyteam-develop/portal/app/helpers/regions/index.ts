import { Region, RegionGroup } from '~/interfaces/response/region';

export const getRegionsFromGroups = (groups: RegionGroup[]): Region[] => { 
    return groups.reduce((regions: Region[], group) => {
        return [...regions, ...group.list];
    }, []);
}
