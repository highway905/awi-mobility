export const CURRENCY = '$';
export const DECIMAL_REGEX = /^([\d]{0,6})(\.[\d]{1,2})?$/;
export const BOX_NAME_REGEX = /^[0-9A-Za-z ]*$/;
export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[`+=!@#$%^&*<>{}()\-_~'":;,|\\/.?\]\\[]).{8,}$/;
// eslint-disable-next-line no-useless-escape
export const PHONE_NUMBER_REGEX = /^\+?([\d\-\(\)\s]){8,25}$/;
export const NMFC_REGEX = /^$|^[0-9A-Za-z]{4,6}$/;
export const UPC_REGEX = /^[a-zA-Z0-9]*$/;
export const MAT_ID_REGEX = /^[0-9]{4}$/;
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const ZIP_CODE_REGEX = /^[a-zA-Z0-9]{1,10}$/;
export const HARMONIZED_TRAFFIC_CODE_REGEX = /^[0-9.]+$/;

export const FAX_REGEX = /^\+?([\d-()\s]){8,25}$/;
export const SIX_DIGIT_NUMBER_REGEX = /^\d{1,6}$/;
