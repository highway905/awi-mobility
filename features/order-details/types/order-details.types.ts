/**
 * Order Details Type Definitions
 * Comprehensive type safety for order details components and API responses
 */

// ============================================================================
// API Response Types - Based on provided API schema
// ============================================================================

/**
 * Order details API request payload interface
 */
export interface OrderDetailsApiPayload {
  orderId: string;
}

/**
 * Address interface
 */
export interface Address {
  id: string;
  businessName: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  shipFromName?: string;
  shipToName?: string;
  stateName: string;
  stateId: string;
  stateCode: string;
  countryName: string;
  countryId: string;
}

/**
 * Customer interface
 */
export interface Customer {
  customerId: string;
  warehouseId: string;
  firstName: string;
  lastName: string;
}

/**
 * Inbound details interface
 */
export interface InboundDetails {
  id: string;
  poNumber: string;
  receiptAdviceNumber: string;
  referenceId: string;
  orderType: string;
  orderTypeId: string;
  notes: string;
  qcNotes: string;
  reasonForReturn: string;
  associatedOutboundTransactionId: string;
}

/**
 * Line item interface
 */
export interface LineItem {
  id: string;
  customerSkuId: string;
  sku: string;
  isNonSku: boolean;
  isBundle: boolean;
  itemName: string;
  universalProductCode: string;
  description: string;
  harmonizedTrafficCode: string | null;
  countryOfOrigin: string | null;
  countryOfOriginId: string | null;
  qty: string;
  lotNumber: string | null;
  expirationDate: string | null;
  orderQuantity: number;
  hasUpdatedActualQuantity: boolean;
}

/**
 * Transload line item interface
 */
export interface TransloadLineItem {
  id: string;
  customerSkuId: string;
  sku: string;
  name: string;
  description: string;
  quantity: number;
  packingUnitOfMeasurementId: string;
  packingUOM: string;
  unitPerPackage: number;
  primaryUnitOfMeasurementId: string;
  primaryUOM: string;
  width: number;
  length: number;
  height: number;
  itemWeight: number;
  weightKg: number;
  volumeCubFt: number;
  volumeCBM: number;
  notes: string;
  hasUpdatedActualQuantity: boolean;
  actualQuantity: number;
  serialNumber: string;
  poNumber: string;
}

/**
 * Delivery appointments interface
 */
export interface DeliveryAppointments {
  id: string;
  estimatedArrivalToWarehouseDate: string;
  estimatedArrivalToWarehouseFromTime: string;
  estimatedArrivalToWarehouseToTime: string;
}

/**
 * Handling details interface
 */
export interface HandlingDetails {
  id: string;
  transportationArrangementName: string;
  transportationArrangementId: string;
  transportationMethodName: string;
  transportationMethodId: string;
  loadTypeName: string;
  loadTypeId: string;
  cargoTypeName: string;
  cargoTypeId: string;
  trailerTypeName: string;
  trailerTypeId: string;
  transportationTypeId: string;
  transportationTypeName: string;
}

/**
 * Transportation schedule interface
 */
export interface TransportationSchedule {
  id: string;
  departureOrigin: string;
  containerETA: string;
  containerATA: string;
  containerPickupLFD: string | null;
  containerReturnLFD: string | null;
}

/**
 * Carrier details interface
 */
export interface CarrierDetails {
  id: string;
  carrier: string;
  carrierId: string;
  serviceType: string;
  serviceTypeId: string;
  scac: string;
  accountNumber: string;
  accountZipOrPostalCode: string;
  billingType: string;
  billingTypeId: string;
  customCarrierName: string;
  isCustomCarrier: boolean;
  customServiceName: string;
  isCustomCarrierService: boolean;
  isIntegrated: boolean;
  isComparedRateChoosed: boolean;
  useShippingMethod: boolean;
  orderShippingRateEstimateId: string;
  isShippingMethod: boolean | null;
  shippingMethod: string | null;
  isInternational: boolean | null;
}

/**
 * Shipping and tracking interface
 */
export interface ShippingAndTracking {
  carrier: string;
  carrierService: string;
  trackingNumber: string;
  transitTime: string | null;
  trackingUrl: string;
}

/**
 * Shipping and tracking details interface
 */
export interface ShippingAndTrackingDetails {
  dateTime: string;
  location: string;
  status: string;
  description: string;
}

/**
 * Order tracking details interface
 */
export interface OrderTrackingDetails {
  shippingAndTracking: ShippingAndTracking;
  shippingAndTrackingDetails: ShippingAndTrackingDetails[] | null;
}

/**
 * Delivery details interface
 */
export interface DeliveryDetails {
  id: string;
  billOfLadingNumber: string;
  trackingNumber: string;
  trailerOrContainerNumber: string;
  loadNumber: string;
  sealNumber: string;
  doorNumber: string;
}

/**
 * Order small parcel shipping details interface
 */
export interface OrderSmallParcelShippingDetails {
  id: string | null;
  requireReturnReceipt: boolean | null;
  residentialDelivery: boolean | null;
  requireInsurance: boolean | null;
  insuranceAmount: number | null;
  saturdayDelivery: boolean | null;
  deliveryConfirmationId: string | null;
  deliveryConfirmationName: string | null;
  internationalContentsTypeId: string | null;
  internationalContentsTypeName: string | null;
  internationalNonDeliveryTypeId: string | null;
  internationalNonDeliveryTypeName: string | null;
  insuranceTypeId: string | null;
  insuranceTypeName: string | null;
  customsValue: number | null;
}

/**
 * Instructions interface
 */
export interface Instructions {
  id: string;
  warehouseInstructions: string;
  carrierInstructions: string;
}

/**
 * Attachment interface
 */
export interface Attachment {
  id: string;
  fileTempName: string;
  fileActualName: string;
  categoryName: string;
  categoryId: string;
}

/**
 * Order log interface
 */
export interface OrderLog {
  id: string;
  orderDetails: string;
  notes: string | null;
  user: string;
  createdDate: string;
}

/**
 * Task log interface (extending order logs)
 */
export interface TaskLog {
  id: string;
  taskDetails: string;
  notes: string | null;
  user: string;
  createdDate: string;
  taskStatus: string;
}

/**
 * Complete order details response interface
 */
export interface OrderDetailsResponse {
  createdBy: string;
  transactionId: string;
  orderStatusId: number;
  taskId: string | null;
  orderStatusText: string;
  isSameAddressAsWarehouse: boolean;
  hasSplitInfo: boolean;
  moveType: string;
  serviceType: string;
  arrivalDate: string | null;
  arrivalReason: string | null;
  previousStatusId: number;
  previousStatusText: string;
  isPackingCompleted: boolean;
  isShipmentLabelGenerated: boolean;
  isShipmentCancelled: boolean;
  shipmentLabelGeneratedDate: string | null;
  shipmentCancelledDate: string | null;
  isShipmentRateEstimateCalculated: boolean;
  isCustomerActionMailSent: boolean;
  createAssociateOutbound: boolean;
  associatedInboundOrderId: string;
  isAWIActionMailSent: boolean;
  isForceComplete: boolean;
  isInternational: boolean;
  returnItemAction: string | null;
  orderCreationTypeId: number;
  shipmentCancellationStatus: string;
  customer: Customer;
  address: {
    fromAddress: Address;
    toAddress: Address;
  };
  inboundDetails: InboundDetails;
  notes: string;
  completionDate: string | null;
  lineItems: LineItem[];
  transloadLineItems: TransloadLineItem[] | null;
  deliveryAppointments: DeliveryAppointments;
  handlingDetails: HandlingDetails;
  transportationSchedule: TransportationSchedule;
  carrierDetails: CarrierDetails;
  orderTrackingDetails: OrderTrackingDetails;
  deliveryDetails: DeliveryDetails;
  orderSmallParcelShippingDetails: OrderSmallParcelShippingDetails;
  instructions: Instructions;
  attachments: Attachment[];
  orderLogs: OrderLog[];
  taskLogs?: TaskLog[]; // Optional for backward compatibility
}

/**
 * API response wrapper
 */
export interface OrderDetailsApiResponse {
  statusCode: number;
  response: OrderDetailsResponse;
  traceId: string;
  message: string;
}

/**
 * API error response structure
 */
export interface OrderDetailsApiErrorResponse {
  statusCode: number;
  response: {
    message: string;
    validationFailed: boolean;
    validationErrors: Array<{
      key: string;
      value: string;
    }>;
  };
  traceId: string;
  message: string;
}

// ============================================================================
// UI/Component Types
// ============================================================================

/**
 * Loading states for different operations
 */
export interface OrderDetailsLoadingStates {
  initial: boolean;
  refreshing: boolean;
  saving: boolean;
}

/**
 * Error states
 */
export interface OrderDetailsErrorStates {
  loadError: string | null;
  saveError: string | null;
  networkError: string | null;
}

/**
 * Order status type with predefined values
 */
export type OrderStatus = 
  | 'Draft'
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
  | 'Print Shipping Document'
  | 'Pending AWI Action';

/**
 * Shipping status type
 */
export type ShippingStatus = 
  | 'No Shipping Label'
  | 'Shipping Label Generated'
  | 'Shipping Label Cancelled';

/**
 * Move type with predefined values
 */
export type MoveType = 'Inbound' | 'Outbound';

/**
 * Service type
 */
export type ServiceType = 'B2B' | 'B2C';
