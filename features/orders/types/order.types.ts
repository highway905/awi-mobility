/**
 * Order Management Type Definitions
 * Comprehensive type safety for the order page components and API responses
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Order list API request payload interface
 */
export interface OrderListApiPayload {
  searchKey?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  pageIndex: number;
  pageSize: number;
  customerId?: string;
  orderListingFilterType?: 'RequestCreated' | 'AppointmentDate' | 'CompletionDate';
  orderListingFilterTypeOption?: 'Last2days' | 'Last7days' | 'Last30days' | 'Custom';
  transactionId?: string;
  serviceTypeId?: string;
  moveType?: 'Inbound' | 'Outbound' | '';
  orderTypes?: string[];
  locationId?: string;
  referenceId?: string;
  statuses?: string[];
  sku?: string;
  taskId?: string;
  trackingNumber?: string;
  transportationArrangementId?: string;
  recipientName?: string;
  recipientAddress?: string;
  recipientState?: string;
  shipperName?: string;
  shipperAddress?: string;
  shipperState?: string;
  transportationMethodId?: string;
  loadTypeId?: string;
  cargoTypeId?: string;
  trailerTypeId?: string;
  trailerNumber?: string;
  createdByName?: string;
  orderList?: string[];
  fromDate?: string;
  toDate?: string;
}

/**
 * Raw order data from API response
 */
export interface OrderApiResponse {
  orderId: string;
  transactionId: string;
  attachmentCount: number;
  orderType: string;
  moveType: string;
  serviceType: string;
  customer: string;
  location: string;
  referenceId: string;
  status: string;
  statusId: number;
  previousStatus: string;
  previousStatusId: number;
  skU_QTY: string;
  taskId: string;
  trackingNo: string;
  trackingUrl: string;
  transportationBy: string;
  shipperName: string;
  shipperAddress: string;
  shipperState: string;
  recipientName: string;
  recipientAddress: string;
  recipientState: string;
  appointmentDate: string;
  appointmentFromTime: string;
  appointmentToTime: string;
  createdOn: string;
  transportationMethod: string;
  loadType: string;
  cargoType: string;
  trailerType: string;
  trailerOrContainerNumber: string;
  createdBy: string;
  completionDate: string;
  orderCreationTypeId: 'BatchUpload' | 'Manual' | 'EDI' | 'Shopify';
  hasMultipleTracking: boolean;
  carrierId: number;
  isIntegrated: boolean;
  carrierService: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  statusCode: number;
  response: T;
  traceId: string;
  message: string;
}

/**
 * Order list API response structure
 */
export interface OrderListApiResponse {
  items: OrderApiResponse[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  message: string;
  validationFailed: boolean;
  validationErrors: Array<{
    key: string;
    value: string;
  }>;
}

// ============================================================================
// UI/Component Types
// ============================================================================

/**
 * Optimized order interface for UI components
 * Only includes fields actually used in the table
 */
export interface Order {
  orderId: string;
  transactionId: string;
  customer: string;
  orderType: string;
  referenceId: string;
  channel: string;
  appointmentDate: string;
  status: string;
  moveType: string;
  serviceType: string;
  location: string;
  trackingNo: string;
  createdOn: string;
  statusId: number;
  // Additional fields for detail view
  skU_QTY?: string;
  taskId?: string;
  attachmentCount?: number;
}

/**
 * Order filter state interface
 */
export interface OrderFilter {
  pageIndex: number;
  pageSize: number;
  searchKey: string;
  sortColumn: string;
  sortDirection: 'asc' | 'desc' | '';
  orderListingFilterType: 'RequestCreated' | 'AppointmentDate' | 'CompletionDate';
  orderListingFilterTypeOption: 'Last2days' | 'Last7days' | 'Last30days' | 'Custom';
  fromDate: string;
  toDate: string;
  transactionId: string;
  serviceTypeId: string;
  moveType: 'Inbound' | 'Outbound' | '';
  orderTypes: string[];
  customerId: string;
  locationId: string;
  referenceId: string;
  statuses: string[];
  sku: string;
  taskId: string;
  trackingNumber: string;
  transportationArrangementId: string;
  recipientName: string;
  recipientCompany: string;
  recipientAddress1: string;
  recipientAddress2: string;
  recipientCity: string;
  recipientState: string;
  recipientCountry: string;
  recipientZipCode: string;
  shipperName: string;
  shipperCompany: string;
  shipperAddress1: string;
  shipperAddress2: string;
  shipperCity: string;
  shipperState: string;
  shipperCountry: string;
  shipperZipCode: string;
  appointmentDate: string;
  createdOn: string;
  transportationMethodId: string;
  loadTypeId: string;
  cargoTypeId: string;
  trailerTypeId: string;
  trailerNumber: string;
  createdByName: string;
  channel: string;
  tags: string;
}

/**
 * Date range interface for filters - compatible with react-day-picker
 */
export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

/**
 * Tab types for order listing
 */
export type OrderTab = 'all' | 'inbound' | 'outbound';

// ============================================================================
// Column Customization Types
// ============================================================================

/**
 * Column setting item interface
 */
export interface ColumnSetting {
  id: string;
  key: string;
  checked: boolean;
}

/**
 * Custom columns settings API payload
 */
export interface CustomColumnsSettingsPayload {
  userId: string;
  listType: 'Order';
}

/**
 * Custom columns settings API response
 */
export interface CustomColumnsSettingsResponse {
  id: string;
  listTypeId: 'Order';
  userId: string;
  settings: string; // JSON string of ColumnSetting[]
}

/**
 * Custom columns settings mutation payload
 */
export interface CustomColumnsSettingsMutationPayload {
  id?: string;
  userId: string;
  listType: 'Order';
  settings: string; // JSON string of ColumnSetting[]
}

/**
 * Custom columns settings mutation response
 */
export interface CustomColumnsSettingsMutationResponse {
  message: string;
  id: string;
}

// ============================================================================
// Table Component Types
// ============================================================================

/**
 * Advanced table column configuration
 */
export interface AdvancedTableColumn<T = any> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  className?: string;
  headerClassName?: string;
  sticky?: 'left' | 'right';
}

/**
 * Bulk action configuration
 */
export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline';
  onClick: (selectedRows: any[]) => void;
}

/**
 * Table sorting state
 */
export interface SortingState {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * Table selection state
 */
export interface SelectionState {
  selectedRows: Set<string>;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Loading states for different operations
 */
export interface LoadingStates {
  initial: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  saving: boolean;
}

/**
 * Error states
 */
export interface ErrorStates {
  loadError: string | null;
  saveError: string | null;
  networkError: string | null;
}

/**
 * Order status type with predefined values
 */
export type OrderStatus = 
  | 'Initialized'
  | 'Ready to Process'
  | 'Unloading'
  | 'Delivered'
  | 'Receiving'
  | 'Putaway'
  | 'Completed'
  | 'Closed'
  | 'Pending Carrier Details'
  | 'Packing'
  | 'Picking'
  | 'Ready to Ship'
  | 'Loading'
  | 'Print Shipping Document';

/**
 * Channel type with predefined values
 */
export type OrderChannel = 'EDI' | 'Shopify' | 'Manual' | 'BatchUpload';

/**
 * Move type with predefined values
 */
export type MoveType = 'Inbound' | 'Outbound';
