export const toJapaneseDateString = (date: string | Date, separate: string = '-'): string => {
  if (!date) return '';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}${separate}${month}${separate}${day}`;
}

export const formatDateWithText = (date: Date | string): string => {
  if (!date) return '';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`
}
