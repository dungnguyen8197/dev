import { OrgDivTypeRO, OrgDivType } from '~/interfaces/org-div-type.interface';
import { SelectOption } from '~/interfaces/select-option';

export const orgDivTypeResponseToSelectOptions = (response: OrgDivTypeRO): SelectOption[] => {
  return response.divisions.map((item: OrgDivType) => ({ label: item.name, value: item.id }));
};
