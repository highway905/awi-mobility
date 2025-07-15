import { successCodes } from '@/constants/successCode';
import { toast } from 'react-toastify';

export const successMessage = (successCode: string | number | null) => {
  if (typeof successCode === 'number') {
    const message: any = successCodes.find((i: any) => i?.code === successCode);
    return toast.success(message?.message);
  }
  return toast.success(successCode);
};
