import {
  invalidEmail,
  invalidRequired,
  invalidLength,
  invalidMaxLength,
  invalidMinLength,
} from "./messages";

export const validateLength = (value: string, length: number): string => {
  if (value.length !== length) {
    return invalidLength(length);
  }

  return '';
}

export const validateEmail = (value: string): string => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return invalidEmail;
  }

  return '';
}

export const validateRequired = (value: string): string => {
  if (value.length === 0) {
    return invalidRequired;
  }

  return '';
}

export const validateMaxLength = (value: string, maxLength: number): string => {
  if (value.length > maxLength) {
    return invalidMaxLength(maxLength);
  }

  return '';
}

export const validateMinLength = (value: string, minLength: number): string => {
  if (value.length < minLength) {
    return invalidMinLength(minLength);
  }

  return '';
}
