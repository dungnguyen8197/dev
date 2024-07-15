import { SelectOption } from '~/interfaces/select-option';

export const nameLines: SelectOption[] = [
  { value: 1, label: 'ア行' },
  { value: 2, label: 'カ行' },
  { value: 3, label: 'サ行' },
  { value: 4, label: 'タ行' },
  { value: 5, label: 'ナ行' },
  { value: 6, label: 'ハ行' },
  { value: 7, label: 'マ行' },
  { value: 8, label: 'ヤ行' },
  { value: 9, label: 'ラ行' },
  { value: 10, label: 'ワ行' },
];

export const getNameLineById = (value: number): string => {
  const nameLine = nameLines.find(type => type.value === value);
  return nameLine ? nameLine.label : '';
}
