export const formatAmount = (amount: number): string => {
  if (!amount) return '';
  return amount.toLocaleString('ja-JP');
}

export const amountToNumber = (amount: string): number => {
  if (amount === '') return 0;
  return parseInt(amount.replace(/,/g, ''));
}