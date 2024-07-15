import { dateExpired, invalidLength, invalidMonthExpired } from "../constants/messages";

import { Wallet } from "../types/support/wallet";

export const validateCreditCard = (wallet: Wallet, field: string) => {
  switch(field) {
    case 'cardNumber':
      return validateCardNumber(wallet);
    case 'expireMonth':
      return validateExpiredMonth(wallet);
    case 'expireYear':
      return validateExpiredYear(wallet);
    case 'cvv':
      return validateCardCvv(wallet);
    default:
      return '';
  }
};

export const validateCardNumber = (wallet: Wallet) => {
  return /^[0-9]{10,16}$/.test(wallet.cardNumber) ? '' : invalidLength('10~16');
};

export const validateExpiredMonth = (wallet: Wallet) => {
  const error = /^[0-9]{2}$/.test(wallet.expireMonth) ? parseInt(wallet.expireMonth) > 12 ? invalidMonthExpired() : '' : invalidLength(2);
  if (error.length <= 0 && wallet.expireMonth && wallet.expireYear) {
    return validateCardErxpired(wallet?.expireMonth, wallet?.expireYear);
  }
  return error;
};

export const validateExpiredYear = (wallet: Wallet) => {
  const error = /^[0-9]{2}$/.test(wallet.expireYear) ? '' : invalidLength(2);
  if (error.length <= 0 && wallet.expireMonth && wallet.expireYear) {
    return validateCardErxpired(wallet?.expireMonth, wallet?.expireYear);
  }
  return error;
};

export const validateCardErxpired = (expireMonth: string, expireYear: string) =>{
  const today = new Date().getTime();
  const yearExpired = new Date().getFullYear().toString().slice(0,2) + expireYear;
  const expireCard = new Date().setFullYear(parseInt(yearExpired), parseInt(expireMonth), 0);
  return today > expireCard ? dateExpired : '';
};

export const validateCardCvv = (wallet: Wallet) =>{
  return /^[0-9]{3,4}$/.test(wallet.cvv) ? '' : invalidLength('3~4');
}
