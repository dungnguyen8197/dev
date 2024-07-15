export interface GMOTokenObject {
  resultCode: string;
  tokenObject: {
    maskedCardNo: string;
    toBeExpiredAt: string;
    isSecurityCodeSet: boolean;
    token: string[];
  }
}

export interface GMOUpdateRequest {
  card_no: string;
  expiration_year: string;
  expiration_month: string;
  exec_tran_token: string;
  save_card_token: string;
}