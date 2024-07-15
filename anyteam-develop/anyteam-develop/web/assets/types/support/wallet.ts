export interface Wallet {
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvv: string;
}

export interface WalletError {
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvv: string;
  common: string;
}