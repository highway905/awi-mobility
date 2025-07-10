/**
 * Order management utility functions
 * Optimized for performance and type safety
 */

import { 
  Order, 
  OrderApiResponse, 
  OrderFilter, 
  OrderListApiPayload,
  OrderTab,
  ColumnSetting,
  OrderStatus,
  OrderChannel
} from '../types/order.types';

// ============================================================================
// Data Transformation Utilities
// ============================================================================

/**
 * Transform API response to optimized Order interface
 * Only maps fields actually used in the UI to reduce memory usage
 */
export const transformApiResponseToOrder = (apiOrder: OrderApiResponse): Order => {
  return {
    orderId: apiOrder.orderId,
    transactionId: apiOrder.transactionId,
    customer: apiOrder.customer || '',
    orderType: apiOrder.orderType || '',
    referenceId: apiOrder.referenceId || '',
    channel: mapOrderCreationTypeToChannel(apiOrder.orderCreationTypeId),
    appointmentDate: formatDate(apiOrder.appointmentDate),
    status: apiOrder.status || '',
    moveType: apiOrder.moveType || '',
    serviceType: apiOrder.serviceType || '',
    location: apiOrder.location || '',
    trackingNo: apiOrder.trackingNo || '',
    createdOn: formatDate(apiOrder.createdOn),
    statusId: apiOrder.statusId,
    // Optional fields for detail view
    skU_QTY: apiOrder.skU_QTY,
    taskId: apiOrder.taskId,
    attachmentCount: apiOrder.attachmentCount,
  };
};

/**
 * Map order creation type to channel display value
 */
export const mapOrderCreationTypeToChannel = (orderCreationTypeId: string): string => {
  const channelMap: Record<string, string> = {
    'BatchUpload': 'Batch Upload',
    'Manual': 'Manual',
    'EDI': 'EDI',
    'Shopify': 'Shopify',
  };
  return channelMap[orderCreationTypeId] || 'Manual';
};

/**
 * Transform filter to API payload with type safety
 */
export const transformFilterToApiPayload = (
  filter: OrderFilter, 
  tabId: OrderTab
): OrderListApiPayload => {
  const payload: OrderListApiPayload = {
    pageIndex: filter.pageIndex,
    pageSize: filter.pageSize,
    searchKey: filter.searchKey || undefined,
    sortColumn: filter.sortColumn || 'transactionId',
    sortDirection: filter.sortDirection || 'asc',
    orderListingFilterType: filter.orderListingFilterType,
    orderListingFilterTypeOption: filter.orderListingFilterTypeOption,
    fromDate: filter.fromDate || undefined,
    toDate: filter.toDate || undefined,
    transactionId: filter.transactionId || undefined,
    serviceTypeId: filter.serviceTypeId || undefined,
    customerId: filter.customerId || undefined,
    locationId: filter.locationId || undefined,
    referenceId: filter.referenceId || undefined,
    sku: filter.sku || undefined,
    taskId: filter.taskId || undefined,
    trackingNumber: filter.trackingNumber || undefined,
    transportationArrangementId: filter.transportationArrangementId || undefined,
    recipientName: filter.recipientName || undefined,
    recipientAddress: filter.recipientAddress1 || undefined,
    recipientState: filter.recipientState || undefined,
    shipperName: filter.shipperName || undefined,
    shipperAddress: filter.shipperAddress1 || undefined,
    shipperState: filter.shipperState || undefined,
    transportationMethodId: filter.transportationMethodId || undefined,
    loadTypeId: filter.loadTypeId || undefined,
    cargoTypeId: filter.cargoTypeId || undefined,
    trailerTypeId: filter.trailerTypeId || undefined,
    trailerNumber: filter.trailerNumber || undefined,
    createdByName: filter.createdByName || undefined,
  };

  // Handle array fields
  if (filter.orderTypes?.length > 0) {
    payload.orderTypes = filter.orderTypes;
  }
  if (filter.statuses?.length > 0) {
    payload.statuses = filter.statuses;
  }

  // Convert tab to moveType
  switch (tabId) {
    case 'inbound':
      payload.moveType = 'Inbound';
      break;
    case 'outbound':
      payload.moveType = 'Outbound';
      break;
    default:
      payload.moveType = '';
      break;
  }

  // Remove undefined values to keep payload clean
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as OrderListApiPayload;
};

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Format date string for display
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
};

/**
 * Format date time string for display
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
};

/**
 * Get date range for default filters
 */
export const getDefaultDateRange = (days: number = 240) => {
  const toDate = new Date();
  toDate.setHours(23, 59, 59, 999);
  
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days + 1);
  fromDate.setHours(0, 0, 0, 0);
  
  return {
    from: fromDate,
    to: toDate,
    fromISO: fromDate.toISOString(),
    toISO: toDate.toISOString(),
  };
};

// ============================================================================
// Style Utilities
// ============================================================================

/**
 * Get status badge style classes
 */
export const getStatusStyle = (status: OrderStatus): string => {
  const statusStyles: Record<OrderStatus, string> = {
    'Initialized': 'bg-blue-100 text-blue-800 border-blue-200',
    'Ready to Process': 'bg-purple-100 text-purple-800 border-purple-200',
    'Unloading': 'bg-orange-100 text-orange-800 border-orange-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200',
    'Receiving': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Putaway': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'Closed': 'bg-gray-100 text-gray-800 border-gray-200',
    'Pending Carrier Details': 'bg-amber-100 text-amber-800 border-amber-200',
    'Packing': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Picking': 'bg-teal-100 text-teal-800 border-teal-200',
    'Ready to Ship': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Loading': 'bg-lime-100 text-lime-800 border-lime-200',
    'Print Shipping Document': 'bg-sky-100 text-sky-800 border-sky-200',
  };
  
  return statusStyles[status as OrderStatus] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Get channel badge style classes
 */
export const getChannelStyle = (channel: OrderChannel | string): string => {
  const channelStyles: Record<string, string> = {
    'EDI': 'bg-purple-100 text-purple-800',
    'Shopify': 'bg-green-100 text-green-800',
    'Manual': 'bg-orange-100 text-orange-800',
    'Batch Upload': 'bg-blue-100 text-blue-800',
    'BatchUpload': 'bg-blue-100 text-blue-800',
  };
  
  return channelStyles[channel] || 'bg-gray-100 text-gray-800';
};

/**
 * Get order type badge style classes
 */
export const getOrderTypeStyle = (orderType: string): string => {
  if (orderType.includes('B2B') || orderType.includes('B2C')) {
    return 'bg-blue-100 text-blue-800';
  }
  return 'bg-green-100 text-green-800';
};

/**
 * Get move type badge style classes
 */
export const getMoveTypeStyle = (moveType: string): string => {
  const moveTypeStyles: Record<string, string> = {
    'Inbound': 'bg-blue-100 text-blue-800',
    'Outbound': 'bg-green-100 text-green-800',
  };
  
  return moveTypeStyles[moveType] || 'bg-gray-100 text-gray-800';
};

// ============================================================================
// Column Customization Utilities
// ============================================================================

/**
 * Parse column settings from API response
 */
export const parseColumnSettings = (settingsString: string): ColumnSetting[] => {
  try {
    return JSON.parse(settingsString) as ColumnSetting[];
  } catch {
    return [];
  }
};

/**
 * Stringify column settings for API payload
 */
export const stringifyColumnSettings = (settings: ColumnSetting[]): string => {
  return JSON.stringify(settings);
};

/**
 * Get default column settings
 */
export const getDefaultColumnSettings = (): ColumnSetting[] => [
  { id: 'transactionId', key: 'Transaction ID', checked: true },
  { id: 'customer', key: 'Customer', checked: true },
  { id: 'orderType', key: 'Order Type', checked: true },
  { id: 'referenceId', key: 'Reference ID', checked: true },
  { id: 'channel', key: 'Channel', checked: true },
  { id: 'appointmentDate', key: 'Appointment Date', checked: true },
  { id: 'status', key: 'Status', checked: true },
  { id: 'moveType', key: 'Move Type', checked: false },
  { id: 'serviceType', key: 'Service Type', checked: false },
  { id: 'location', key: 'Warehouse', checked: false },
  { id: 'trackingNo', key: 'Tracking #', checked: false },
  { id: 'createdOn', key: 'Created At', checked: false },
  { id: 'skU_QTY', key: 'SKU/QTY', checked: false },
  { id: 'taskId', key: 'Task ID', checked: false },
];

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate order filter values
 */
export const validateOrderFilter = (filter: Partial<OrderFilter>): string[] => {
  const errors: string[] = [];
  
  if (filter.pageIndex && filter.pageIndex < 1) {
    errors.push('Page index must be greater than 0');
  }
  
  if (filter.pageSize && (filter.pageSize < 1 || filter.pageSize > 100)) {
    errors.push('Page size must be between 1 and 100');
  }
  
  if (filter.fromDate && filter.toDate) {
    const fromDate = new Date(filter.fromDate);
    const toDate = new Date(filter.toDate);
    
    if (fromDate > toDate) {
      errors.push('From date cannot be later than to date');
    }
  }
  
  return errors;
};

// ============================================================================
// Performance Utilities
// ============================================================================

/**
 * Debounce function for search and filter operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Create stable object reference for memoization
 */
export const createStableObject = <T extends Record<string, any>>(obj: T): T => {
  const sortedKeys = Object.keys(obj).sort();
  const stableObj = {} as T;
  
  for (const key of sortedKeys) {
    stableObj[key as keyof T] = obj[key as keyof T];
  }
  
  return stableObj;
};

// ============================================================================
// Local Storage Utilities
// ============================================================================

/**
 * Safely get item from localStorage
 */
export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 */
export const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

/**
 * Get default order filter with proper typing
 */
export const getDefaultOrderFilter = (): OrderFilter => {
  const { fromISO, toISO } = getDefaultDateRange();
  
  return {
    pageIndex: 1,
    pageSize: 20,
    searchKey: '',
    sortColumn: 'transactionId',
    sortDirection: 'asc',
    orderListingFilterType: 'RequestCreated',
    orderListingFilterTypeOption: 'Custom',
    fromDate: fromISO,
    toDate: toISO,
    transactionId: '',
    serviceTypeId: '',
    moveType: '',
    orderTypes: [],
    customerId: '',
    locationId: '',
    referenceId: '',
    statuses: [],
    sku: '',
    taskId: '',
    trackingNumber: '',
    transportationArrangementId: '',
    recipientName: '',
    recipientCompany: '',
    recipientAddress1: '',
    recipientAddress2: '',
    recipientCity: '',
    recipientState: '',
    recipientCountry: '',
    recipientZipCode: '',
    shipperName: '',
    shipperCompany: '',
    shipperAddress1: '',
    shipperAddress2: '',
    shipperCity: '',
    shipperState: '',
    shipperCountry: '',
    shipperZipCode: '',
    appointmentDate: '',
    createdOn: '',
    transportationMethodId: '',
    loadTypeId: '',
    cargoTypeId: '',
    trailerTypeId: '',
    trailerNumber: '',
    createdByName: '',
    channel: '',
    tags: '',
  };
};
