export const purchaseTypes = [
  { 
    id: 1,
    label: '通常',
    displayedLabel: '通常支援',
    description: '応援したい部活への支援を、ご指定の金額で「1回」行います。',
    color: 'primary',
    minAmount: 1000,
    image: '/public/images/organizations/icon-support-method-normal.svg',
    currency: '円〜',
  },
  { 
    id: 2,
    label: '定期',
    displayedLabel: '定期支援',
    description: '応援したい部活への支援を、ご指定の金額で「毎月(合計12回)」行います。',
    color: 'info',
    minAmount: 500,
    image: '/public/images/organizations/icon-support-method-regular.svg',
    currency: '円〜/月',
  },
]

export const getPurchaseType = (label: string) => {
  return purchaseTypes.find((purchaseType) => purchaseType.label === label) || purchaseTypes[0];
}

export class PurchaseTypeVO {
  id: number;
  label: string;
  displayedLabel: string;
  description: string;
  color: string;
  minAmount: number;
  image: string;
  currency: string;

  constructor(id: number) {
    const purchaseType = purchaseTypes.find((purchaseType) => purchaseType.id === id) || purchaseTypes[0];
    this.id = purchaseType.id;
    this.label = purchaseType.label;
    this.displayedLabel = purchaseType.displayedLabel;
    this.description = purchaseType.description;
    this.color = purchaseType.color;
    this.minAmount = purchaseType.minAmount;
    this.image = purchaseType.image;
    this.currency = purchaseType.currency;
  }

  validateMinAmount(amount: number): boolean {
    return amount >= this.minAmount;
  } 
}
