/**
 * Order Details Utility Functions
 * Helper functions for order details data processing and transformations
 */

import type { 
  OrderDetailsResponse,
  OrderDetailsApiResponse,
  OrderStatus,
  ShippingStatus,
  ServiceType,
  MoveType
} from '../types/order-details.types'

// ============================================================================
// Data Transformation Functions
// ============================================================================

/**
 * Transform API response to order details
 */
export function transformApiResponseToOrderDetails(response: any): OrderDetailsResponse | null {
  try {
    if (!response || typeof response !== 'object') {
      return null
    }

    // Ensure required fields exist
    if (!response.transactionId && !response.orderId) {
      return null
    }

    // Return the response as is if it already has the correct structure
    return response as OrderDetailsResponse
  } catch (error) {
    return null
  }
}

/**
 * Get order status display text with fallback
 */
export function getOrderStatusText(
  orderDetails: OrderDetailsResponse | null,
  fallback: string = 'Unknown'
): string {
  return orderDetails?.orderStatusText || fallback
}

/**
 * Get shipping status based on order details
 */
export function getShippingStatusText(
  orderDetails: OrderDetailsResponse | null
): ShippingStatus {
  if (!orderDetails) {
    return 'No Shipping Label'
  }

  if (orderDetails.isShipmentLabelGenerated) {
    return orderDetails.isShipmentCancelled 
      ? 'Shipping Label Cancelled' 
      : 'Shipping Label Generated'
  }

  return 'No Shipping Label'
}

/**
 * Get service type with fallback
 */
export function getServiceTypeText(
  orderDetails: OrderDetailsResponse | null,
  fallback: string = 'Loading...'
): string {
  return orderDetails?.serviceType || fallback
}

/**
 * Get transaction ID with fallback
 */
export function getTransactionId(
  orderDetails: OrderDetailsResponse | null,
  orderId: string
): string {
  return orderDetails?.transactionId || orderId
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate order details response structure
 */
export function validateOrderDetailsResponse(response: any): boolean {
  if (!response || typeof response !== 'object') {
    return false
  }

  // Check for required fields
  const requiredFields = ['transactionId', 'orderStatusText', 'serviceType', 'moveType']
  
  for (const field of requiredFields) {
    if (!(field in response)) {
      return false
    }
  }

  return true
}

/**
 * Check if order details are complete for display
 */
export function isOrderDetailsComplete(orderDetails: OrderDetailsResponse | null): boolean {
  if (!orderDetails) return false
  
  return !!(
    orderDetails.transactionId &&
    orderDetails.orderStatusText &&
    orderDetails.serviceType
  )
}

// ============================================================================
// Data Processing Functions
// ============================================================================

/**
 * Get safe line items array
 */
export function getSafeLineItems(orderDetails: OrderDetailsResponse | null) {
  return orderDetails?.lineItems || []
}

/**
 * Get safe attachments array
 */
export function getSafeAttachments(orderDetails: OrderDetailsResponse | null) {
  return orderDetails?.attachments || []
}

/**
 * Get safe order logs array
 */
export function getSafeOrderLogs(orderDetails: OrderDetailsResponse | null) {
  return orderDetails?.orderLogs || []
}

/**
 * Get safe task logs array
 */
export function getSafeTaskLogs(orderDetails: OrderDetailsResponse | null) {
  return orderDetails?.taskLogs || []
}

/**
 * Get safe handling details with fallback values
 */
export function getSafeHandlingDetails(orderDetails: OrderDetailsResponse | null) {
  const details = orderDetails?.handlingDetails
  if (!details) {
    return {
      id: '',
      transportationArrangementName: '',
      transportationArrangementId: '',
      transportationMethodName: '',
      transportationMethodId: '',
      trailerTypeName: '',
      trailerTypeId: ''
    }
  }
  return details
}

/**
 * Get safe transportation schedule with fallback values
 */
export function getSafeTransportationSchedule(orderDetails: OrderDetailsResponse | null) {
  const schedule = orderDetails?.transportationSchedule
  if (!schedule) {
    return {
      id: '',
      departureOrigin: '',
      containerETA: '',
      containerATA: '',
      needByShipDate: '',
      warehouseInstructions: '',
      carrierInstructions: ''
    }
  }
  return schedule
}

/**
 * Get safe carrier details with fallback values
 */
export function getSafeCarrierDetails(orderDetails: OrderDetailsResponse | null) {
  const carrier = orderDetails?.carrierDetails
  if (!carrier) {
    return {
      id: '',
      carrier: '',
      carrierId: '',
      serviceType: '',
      serviceTypeId: '',
      shippingMethod: null,
      scac: '',
      accountNumber: '',
      accountZipOrPostalCode: '',
      billingType: '',
      billingTypeId: '',
      customCarrierName: '',
      isCustomCarrier: false,
      customServiceName: '',
      isCustomCarrierService: false,
      isIntegrated: false,
      isComparedRateChoosed: false,
      useShippingMethod: false,
      orderShippingRateEstimateId: '',
      isShippingMethod: null,
      isInternational: null
    }
  }
  return carrier
}

/**
 * Get safe tracking details with fallback values
 */
export function getSafeTrackingDetails(orderDetails: OrderDetailsResponse | null) {
  const tracking = orderDetails?.orderTrackingDetails
  if (!tracking) {
    return {
      shippingAndTracking: {
        carrier: '',
        carrierService: '',
        trackingNumber: '',
        transitTime: '',
        trackingUrl: ''
      }
    }
  }
  return tracking
}

/**
 * Get safe delivery details with fallback values
 */
export function getSafeDeliveryDetails(orderDetails: OrderDetailsResponse | null) {
  const delivery = orderDetails?.deliveryDetails
  if (!delivery) {
    return {
      id: '',
      billOfLadingNumber: '',
      trackingNumber: '',
      trailerOrContainerNumber: '',
      loadNumber: '',
      sealNumber: '',
      doorNumber: ''
    }
  }
  return delivery
}

/**
 * Get safe instructions with fallback values
 */
export function getSafeInstructions(orderDetails: OrderDetailsResponse | null) {
  const instructions = orderDetails?.instructions
  if (!instructions) {
    return {
      id: '',
      warehouseInstructions: '',
      carrierInstructions: ''
    }
  }
  return instructions
}

// ============================================================================
// Status Helper Functions
// ============================================================================

/**
 * Check if order is in progress
 */
export function isOrderInProgress(orderDetails: OrderDetailsResponse | null): boolean {
  if (!orderDetails) return false
  
  const inProgressStatuses: OrderStatus[] = [
    'Ready to Process',
    'Unloading',
    'Receiving',
    'Putaway',
    'Packing',
    'Picking',
    'Ready to Ship',
    'Loading'
  ]
  
  return inProgressStatuses.includes(orderDetails.orderStatusText as OrderStatus)
}

/**
 * Check if order is completed
 */
export function isOrderCompleted(orderDetails: OrderDetailsResponse | null): boolean {
  if (!orderDetails) return false
  
  const completedStatuses: OrderStatus[] = ['Completed', 'Closed', 'Delivered']
  return completedStatuses.includes(orderDetails.orderStatusText as OrderStatus)
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(orderDetails: OrderDetailsResponse | null): boolean {
  if (!orderDetails) return false
  
  const nonCancellableStatuses: OrderStatus[] = ['Completed', 'Closed', 'Delivered']
  return !nonCancellableStatuses.includes(orderDetails.orderStatusText as OrderStatus)
}

// ============================================================================
// Date Helper Functions
// ============================================================================

/**
 * Format date for display
 */
export function formatDateForDisplay(dateString: string | null): string {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Get estimated arrival date formatted
 */
export function getFormattedEstimatedArrival(orderDetails: OrderDetailsResponse | null): string {
  return formatDateForDisplay(orderDetails?.deliveryAppointments?.estimatedArrivalToWarehouseDate || null)
}

/**
 * Get creation date formatted
 */
export function getFormattedCreationDate(orderDetails: OrderDetailsResponse | null): string {
  const latestLog = orderDetails?.orderLogs?.[0]
  return formatDateForDisplay(latestLog?.createdDate || null)
}

// ============================================================================
// Error Message Constants
// ============================================================================

export const ORDER_DETAILS_ERRORS = {
  LOAD_FAILED: 'Failed to load order details. Please try again.',
  INVALID_ORDER_ID: 'Invalid order ID provided.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to view this order.',
  NOT_FOUND: 'Order not found. It may have been deleted or moved.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Order data validation failed.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
} as const

export type OrderDetailsError = typeof ORDER_DETAILS_ERRORS[keyof typeof ORDER_DETAILS_ERRORS]
