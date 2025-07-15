/**
 * Custom Hooks for Order Details Management
 * Reusable hooks following the patterns established in the orders feature
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { handleApiError, ErrorType } from '@/utils/errorHandler'
import { useGetInboundDetailsMutation } from '@/lib/redux/api/orderManagement'
import { 
  transformApiResponseToOrderDetails,
  validateOrderDetailsResponse,
  getOrderStatusText,
  getShippingStatusText,
  getServiceTypeText,
  getTransactionId,
  ORDER_DETAILS_ERRORS
} from '../utils/order-details.utils'
import type { 
  OrderDetailsResponse,
  OrderDetailsLoadingStates,
  OrderDetailsErrorStates,
  OrderDetailsApiPayload
} from '../types/order-details.types'

// ============================================================================
// Loading and Error State Management Hooks
// ============================================================================

/**
 * Hook for managing loading states
 */
export function useOrderDetailsLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<OrderDetailsLoadingStates>({
    initial: false,
    refreshing: false,
    saving: false,
  })

  const updateLoadingState = useCallback((key: keyof OrderDetailsLoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }))
  }, [])

  return { loadingStates, updateLoadingState }
}

/**
 * Hook for managing error states
 */
export function useOrderDetailsErrorStates() {
  const [errorStates, setErrorStates] = useState<OrderDetailsErrorStates>({
    loadError: null,
    saveError: null,
    networkError: null,
  })

  const setError = useCallback((key: keyof OrderDetailsErrorStates, error: string | null) => {
    setErrorStates(prev => ({ ...prev, [key]: error }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrorStates({
      loadError: null,
      saveError: null,
      networkError: null,
    })
  }, [])

  return { errorStates, setError, clearErrors }
}

// ============================================================================
// API Processing Hook
// ============================================================================

/**
 * Hook for processing order details API responses
 */
export function useOrderDetailsApiProcessor() {
  const processOrderDetailsResponse = useCallback((
    response: any
  ): OrderDetailsResponse | null => {
    try {
      // Handle different response structures after Redux transform
      if (!response) {
        return null
      }

      // Validate and transform the response
      const transformedData = transformApiResponseToOrderDetails(response)
      
      if (transformedData && validateOrderDetailsResponse(transformedData)) {
        return transformedData
      }

      return null
    } catch (error) {
      return null
    }
  }, [])

  return { processOrderDetailsResponse }
}

// ============================================================================
// Main Order Details Hook
// ============================================================================

/**
 * Main hook for managing order details data and state
 */
export function useOrderDetails(orderId: string) {
  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null)
  const { loadingStates, updateLoadingState } = useOrderDetailsLoadingStates()
  const { errorStates, setError, clearErrors } = useOrderDetailsErrorStates()
  const { processOrderDetailsResponse } = useOrderDetailsApiProcessor()
  
  // Initialize the API hook from RTK Query
  const [getInboundDetails, { isLoading: isApiLoading }] = useGetInboundDetailsMutation()

  // Decode orderId to handle URL encoding
  const decodedOrderId = useMemo(() => {
    return decodeURIComponent(orderId)
  }, [orderId])

  // Create stable API payload
  const apiPayload = useMemo((): OrderDetailsApiPayload => ({
    orderId: decodedOrderId
  }), [decodedOrderId])

  // Fetch order details function
  const fetchOrderDetails = useCallback(async (showLoading = true) => {
    if (!decodedOrderId) {
      setError('loadError', ORDER_DETAILS_ERRORS.INVALID_ORDER_ID)
      return
    }

    try {
      if (showLoading) {
        updateLoadingState('initial', true)
      } else {
        updateLoadingState('refreshing', true)
      }
      
      clearErrors()

      const response = await getInboundDetails(apiPayload).unwrap()
      
      const processedData = processOrderDetailsResponse(response)
      
      if (processedData) {
        setOrderDetails(processedData)
      } else {
        setError('loadError', ORDER_DETAILS_ERRORS.LOAD_FAILED)
      }
      
    } catch (error: any) {
      
      // Use centralized error handler
      const errorInfo = handleApiError(error, {
        showToast: true,
        redirect: false, // Don't redirect from order details page
        logToConsole: true,
      })
      
      // Set appropriate error state based on error type
      let errorMessage: string = ORDER_DETAILS_ERRORS.UNKNOWN_ERROR
      
      switch (errorInfo.type) {
        case ErrorType.NETWORK:
          errorMessage = ORDER_DETAILS_ERRORS.NETWORK_ERROR
          setError('networkError', errorMessage)
          break
        case ErrorType.AUTHENTICATION:
          errorMessage = ORDER_DETAILS_ERRORS.UNAUTHORIZED
          setError('loadError', errorMessage)
          break
        case ErrorType.NOT_FOUND:
          errorMessage = ORDER_DETAILS_ERRORS.NOT_FOUND
          setError('loadError', errorMessage)
          break
        case ErrorType.SERVER:
          errorMessage = ORDER_DETAILS_ERRORS.SERVER_ERROR
          setError('loadError', errorMessage)
          break
        case ErrorType.VALIDATION:
          errorMessage = ORDER_DETAILS_ERRORS.VALIDATION_ERROR
          setError('loadError', errorMessage)
          break
        default:
          setError('loadError', errorInfo.message || errorMessage)
          break
      }
      
    } finally {
      updateLoadingState('initial', false)
      updateLoadingState('refreshing', false)
    }
  }, [decodedOrderId, apiPayload, getInboundDetails, processOrderDetailsResponse, updateLoadingState, setError, clearErrors])

  // Initial fetch on mount
  useEffect(() => {
    fetchOrderDetails(true)
  }, [fetchOrderDetails])

  // Refresh function for manual refresh
  const refreshOrderDetails = useCallback(() => {
    fetchOrderDetails(false)
  }, [fetchOrderDetails])

  // Computed loading state
  const isLoading = loadingStates.initial || isApiLoading
  const isRefreshing = loadingStates.refreshing

  // Computed error state
  const hasError = !!(errorStates.loadError || errorStates.networkError || errorStates.saveError)
  const errorMessage = errorStates.loadError || errorStates.networkError || errorStates.saveError

  return {
    // Data
    orderDetails,
    
    // Loading states
    isLoading,
    isRefreshing,
    loadingStates,
    
    // Error states
    hasError,
    errorMessage,
    errorStates,
    
    // Actions
    refreshOrderDetails,
    clearErrors,
    
    // Computed values
    isEmpty: !orderDetails && !isLoading && !hasError,
    transactionId: getTransactionId(orderDetails, decodedOrderId),
    orderStatus: getOrderStatusText(orderDetails, 'Loading...'),
    serviceType: getServiceTypeText(orderDetails, 'Loading...'),
    shippingStatus: getShippingStatusText(orderDetails),
  }
}

// ============================================================================
// Navigation Hook
// ============================================================================

/**
 * Hook for handling order details navigation
 */
export function useOrderDetailsNavigation() {
  const router = useRouter()

  const navigateToOrders = useCallback((searchQuery?: string) => {
    const url = searchQuery ? `/orders?search=${encodeURIComponent(searchQuery)}` : '/orders'
    router.push(url)
  }, [router])

  const navigateToOrder = useCallback((orderId: string) => {
    router.push(`/order-details/${encodeURIComponent(orderId)}`)
  }, [router])

  return { navigateToOrders, navigateToOrder }
}

// ============================================================================
// Mock Data Hook (for development/fallback)
// ============================================================================
