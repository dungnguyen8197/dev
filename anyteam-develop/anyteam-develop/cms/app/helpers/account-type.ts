import { SelectOption } from '~/interfaces/select-option';

export const accountTypes: SelectOption[] = [
    { value: 1, label: '普通預金' },
    { value: 2, label: '貯蓄預金' },
    { value: 3, label: '当座預金' },
]

export const getAccountTypeById = (value: number): string => {
    const accountType = accountTypes.find(type => type.value === value);
    return accountType ? accountType.label : '';
}
