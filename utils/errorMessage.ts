/* eslint-disable @typescript-eslint/no-unused-expressions */
import { errorCodes } from '@/constants/errorCode';
import { toast } from 'react-toastify';

export const errorMessage = (errorCode: any, toastObject?: any) => {
  // need to create a switch case for get data error from object
  // and need to return it in condition from data error response
  let message: any = '';
  typeof errorCode === 'string'
    ? (message = errorCode)
    : (message = errorCodes.find((i: any) => i?.code === errorCode)?.message);

  return toast.error(message, toastObject);
};
