// types of users
export const USER_TYPES = {
  CUSTOMER: 'Customer User',
  CUSTOMER_ADMIN: 'Customer Admin',
  TYPE_SKU: 'sku',
  TYPE_NONSKU: 'nonSku',
};

export const BATCH_TYPE = {
  SKU: 'SKU',
  ORDER: 'ORDER',
  BATCHUPDATE: 'BATCHUPDATE',
  BATCHUPLOAD: 'BATCHUPLOAD'
};
export const NAME_MAX_LENGTH = 26;

export const MOVE_TYPE = {
  INBOUND: 'Inbound',
  OUTBOUND: 'Outbound',
};

export const ORDER_TYPE = {
  B2B: 'B2b',
  B2C: 'B2c',
};

export const SHIPPING_LABEL_ATTACHMENT = 'Shipping Label';
export const TPN_METHOD_CONTAINER = 'Container';
export const TPN_METHOD_TRUCK = 'Truck';
export const TPN_METHOD_DIRECT_PICKUP = 'Direct Pickup';
export const TPN_METHOD_PARCEL = 'Parcel';
export const TPN_TYPE_AWI = 'AWI';
export const ORDER_STATUS = {
  Draft: 1,
  Initialized: 2,
  PendingClientAction: 12,
  PendingCarrierDetails: 20,
  generateShippingLabel: 21,
  loading: 17,
  picking: 14,
  packing: 15,
  readyToShip: 16,
  PendingAWIAction: 13,
  ReadyToProcess: 3,
  Unloading: 4,
  Delivered: 5,
  Receiving: 6,
  Putaway: 7,
  Complete: 8,
  Closed: 9,
  OnHold: 10,
  Cancelled: 11,
  needsImmediateAction: 19,
};

export const AWI_USERS = [
  'Admin',
  'Ops. Manager',
  'Ops. Staff',
  'Whs. Supervisor',
  'Whs. Manager',
  'Whs. Associate',
];

export const RETURN_ORDER_TYPES = ['B2B Returns', 'B2C Returns'];

export const arraysHaveChanges = (arr1: any, arr2: any): boolean => {
  // Convert arrays of objects to arrays of strings
  const arr1Strings = arr1?.map((obj: any) => JSON.stringify(obj));
  const arr2Strings = arr2?.map((obj: any) => JSON.stringify(obj));

  // Convert arrays of strings to sets
  const arr1Set: any = new Set(arr1Strings);
  const arr2Set: any = new Set(arr2Strings);

  // Check for differences between the two sets
  return (
    [...arr1Set]?.some((item) => !arr2Set?.has(item)) ||
    [...arr2Set]?.some((item) => !arr1Set?.has(item))
  );
};

export const tabIdChecker = (checkId: string) => {
  switch (checkId) {
    case 'Line Items':
      return 'line-item';
      break;
    case 'Attachments':
      return 'attachments';
      break;
    case 'Transportation Details':
      return 'transportation-details';
      break;
    case 'Shipping and Tracking':
      return 'shipping-tracking';
      break;
    case 'Warehouse Action':
      return 'warehouse-action';
      break;
    case 'Log':
      return 'log';
    default:
      return null;
      break;
  }
};
