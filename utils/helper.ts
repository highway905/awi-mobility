import { AWI_USERS } from '@/constants/common';
import { EMAIL_REGEX } from '@/constants/regex';
import { isNull, isString, isUndefined, isEmpty } from 'lodash';
import Cookies from 'js-cookie';

export const loginCredentials = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    try {
      // Store in localStorage
      localStorage.setItem(key, JSON.stringify(value));
      
      // Also store in cookies for middleware access
      if (key === 'userCred' && value?.token) {
        Cookies.set('userCred', JSON.stringify({
          token: value.token,
          id: value.id,
          role: value.role
        }), { expires: 1, path: '/' }); // 1 day expiry
      }
    } catch (error) {
      console.error('Error storing credentials:', error);
    }
  }
};

export const getUserCred = (key: string) => {
  if (typeof window !== 'undefined') {
    try {
      const storedUserCredStr: any = window.localStorage.getItem(key);
      if (!isEmpty(storedUserCredStr) && storedUserCredStr !== 'undefined') {
        return JSON.parse(storedUserCredStr);
      }
      
      // Fallback to cookies for middleware
      if (key === 'userCred') {
        const cookieValue = Cookies.get('userCred');
        if (cookieValue) {
          return JSON.parse(cookieValue);
        }
      }
    } catch (error) {
      console.error('Error retrieving credentials:', error);
    }
  }
  return null;
};

export const resetUserCred = () => {
  if (typeof window !== 'undefined') {
    try {
      // Clear localStorage
      localStorage.removeItem('userCred');
      localStorage.removeItem('orderListFilter');
      localStorage.removeItem('orderCurrentTab');
      
      // Clear cookies
      Cookies.remove('userCred', { path: '/' });
    } catch (error) {
      console.error('Error resetting credentials:', error);
    }
  }
  return null;
};

export const checkIfValidEmail = (value: string) => new RegExp(EMAIL_REGEX).test(value);

export const checkIfAccess = (accessKey: String) => {
  if (!accessKey) return false;
  const userCred = getUserCred('userCred');
  return userCred?.roleClaims?.includes(accessKey);
};

export const downloadFileFromURL = (url: string) => {
  if (url && typeof document !== 'undefined' && document.createElement) {
    const link = document.createElement('a');
    link.href = url;
    link.download = new URL(url)?.pathname; // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const checkIfAWIUser: any = () => {
  const userCred = getUserCred('userCred');
  return AWI_USERS?.includes(userCred?.role);
};

export const checkIfCustomerUser: any = () => {
  const userCred = getUserCred('userCred');
  return ['Customer User', 'Customer Admin']?.includes(userCred?.role);
};

export const downloadStringAsFile = (fileName: string, data: string) => {
  if (typeof window !== 'undefined') {
    const bData = new Blob([data], { type: 'text/plain' });
    const fileURL = window.URL.createObjectURL(bData);
    const tempLink = document.createElement('a');
    tempLink.href = fileURL;
    tempLink.setAttribute('download', fileName);
    tempLink.click();
  }
};

export const formatNumber = (n: number) => {
  return n && n.toFixed(2).replace('.00', '');
};

// function to get local time zone from users system
export const getTimeZoneName = () => {
  if (typeof Intl !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return '';
};

// function to format date strings
export const formatDate = (dateString: string | Date, options?: Intl.DateTimeFormatOptions) => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const truncateText = (text: string | undefined, length: number) =>
  text && text?.length > length ? `${text.substring(0, length)}...` : text;

const ADMIN_ROLES = [
  'Admin',
  'Warehouse Manager',
  'Warehouse Supervisor',
  'Ops. Manager',
  'Ops. Staff',
];
const CUSTOMER_ROLES = ['Customer User', 'Customer Admin'];

const MANAGER_ROLES = ['Admin', 'Warehouse Manager', 'Warehouse Supervisor', 'Ops. Manager'];

export const USER_STORAGE_KEY = 'userCred';

export const isAdminRole = () => {
  if (typeof window !== 'undefined') {
    const storedUserCredStr: any = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!isEmpty(storedUserCredStr) && storedUserCredStr !== 'undefined') {
      try {
        const storage = JSON.parse(storedUserCredStr)?.role;
        return ADMIN_ROLES.includes(storage);
      } catch (error) {
        console.error('Error parsing user credentials:', error);
        return false;
      }
    }
  }
  return false;
};

export const isCustomerRole = () => {
  if (typeof window !== 'undefined') {
    const storedUserCredStr: any = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!isEmpty(storedUserCredStr) && storedUserCredStr !== 'undefined') {
      try {
        const storage = JSON.parse(storedUserCredStr)?.role;
        return CUSTOMER_ROLES.includes(storage);
      } catch (error) {
        console.error('Error parsing user credentials:', error);
        return false;
      }
    }
  }
  return false;
};

export const isManagers = () => {
  if (typeof window !== 'undefined') {
    const storedUserCredStr: any = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!isEmpty(storedUserCredStr) && storedUserCredStr !== 'undefined') {
      try {
        const storage = JSON.parse(storedUserCredStr)?.role;
        return MANAGER_ROLES.includes(storage);
      } catch (error) {
        console.error('Error parsing user credentials:', error);
        return false;
      }
    }
  }
  return false;
};

export const isValue = (value: any) => {
  return isUndefined(value) || isNull(value) || (isString(value) && value === '');
};

export const wareHouseUserIds = () => {
  if (typeof window !== 'undefined') {
    const storedWarehouseDetails = window.localStorage.getItem('warehouseIds');
    if (storedWarehouseDetails) {
      try {
        const storage = JSON.parse(storedWarehouseDetails)?.warehouseIds;
        return storage;
      } catch (error) {
        console.error('Error parsing warehouse IDs:', error);
        return null;
      }
    }
  }
  return null;
};

// get user ID
export const getUserId = () => {
  if (typeof window !== 'undefined') {
    const storedUserCredStr: any = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!isEmpty(storedUserCredStr) && storedUserCredStr !== 'undefined') {
      try {
        const storage = JSON.parse(storedUserCredStr)?.id;
        return storage;
      } catch (error) {
        console.error('Error parsing user credentials:', error);
        return null;
      }
    }
  }
  return null;
};

export const orderPageFilterSaved = (key: any, value: any) => {
  if (typeof window !== 'undefined') {
    return localStorage.setItem(key, JSON.stringify(value));
  }
};

export function getUniqueIds(array: any) {
  const seenIds = new Set();
  seenIds.add('');
  return array?.filter((obj: any) => {
    if (seenIds.has(obj.boxNumber)) {
      return false;
    }
    seenIds.add(obj.boxNumber);
    return true;
  });
}

export const handleInputValidation = (e: React.ChangeEvent<HTMLInputElement>, rowValue?: any) => {
  const val: any = e?.target.value;
  if (/^\d*$/.test(val) && val >= 0 && val.length <= 10) {
    e.target.value = val;
  } else {
    e.target.value = rowValue?.toString() ?? '';
  }
};

export const handleValidation = (e: React.ChangeEvent<HTMLInputElement>, rowValue?: any) => {
  const val: any = e?.target.value;
  if (/^\d*$/.test(val) && val >= 0 && val.length <= 30) {
    e.target.value = val;
  } else {
    e.target.value = rowValue?.toString() ?? '';
  }
};

export const handleDecValidation = (e: React.ChangeEvent<HTMLInputElement>, rowValue?: any) => {
  const val: string = e?.target.value;
  const regex = /^\d{0,6}(?:\.\d{0,2})?$/;

  if (val.length <= 9) {
    // Check if the input length is within 8
    if (regex.test(val)) {
      e.target.value = val;
    } else {
      e.target.value = rowValue?.toString() ?? '';
    }
  } else {
    e.target.value = rowValue?.toString() ?? '';
  }
};

export const orderCurrentTabSaved = (key: any, value: any) => {
  if (typeof window !== 'undefined') {
    return localStorage.setItem(key, value);
  }
};