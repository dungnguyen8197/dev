export interface MeWalletRO {
  card_no: string;
  payment_method: string;
  expiration_year: string;
  expiration_month: string;
}

export interface WalletEditRO {
  wallet: MeWalletRO;
}
