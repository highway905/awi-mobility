import { useState, useMemo } from "react"
import { useTabManagement } from "./use-tab-management"
import { useOrderDetails } from "./useOrderDetailsHooks"
import { useGetPrintPalletLabelsQuery } from "@/lib/redux/api/orderManagement"
import { 
  getSafeAttachments,
  getSafeHandlingDetails,
  getSafeTransportationSchedule,
  getSafeCarrierDetails,
  getSafeTrackingDetails,
  getSafeDeliveryDetails,
  getSafeLineItems,
  getSafeOrderLogs,
  getSafeTaskLogs,
  getSafeInstructions
} from "../utils/order-details.utils"

interface UseOrderDetailsPageProps {
  orderId: string
}

export function useOrderDetailsPage({ orderId }: UseOrderDetailsPageProps) {
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Tab Management
  const { activeTab, loading: tabLoading, handleTabChange } = useTabManagement("order-details")
  
  // Order Details Data
  const {
    orderDetails,
    isLoading: orderDetailsLoading,
    isRefreshing,
    hasError,
    errorMessage,
    isEmpty,
    transactionId,
    orderStatus,
    serviceType,
    shippingStatus,
    refreshOrderDetails,
    clearErrors
  } = useOrderDetails(orderId)

  // Pallet Labels Data for warehouse action
  const palletLabelsPayload = useMemo(() => ({
    searchKey: "",
    sortColumn: "",
    sortDirection: "",
    pageIndex: 1,
    pageSize: 100,
    orderId: decodeURIComponent(orderId)
  }), [orderId])

  const {
    data: palletLabelsData,
    error: palletLabelsError,
    isLoading: palletLabelsLoading,
  } = useGetPrintPalletLabelsQuery(palletLabelsPayload, {
    skip: !orderId || orderId === 'undefined'
  })

  // Computed States
  const isOverallLoading = orderDetailsLoading || tabLoading
  
  // Safe data getters with null checks
  const safeData = useMemo(() => {
    if (!orderDetails) return null
    
    return {
      attachments: getSafeAttachments(orderDetails),
      handlingDetails: getSafeHandlingDetails(orderDetails),
      transportationSchedule: getSafeTransportationSchedule(orderDetails),
      carrierDetails: getSafeCarrierDetails(orderDetails),
      trackingDetails: getSafeTrackingDetails(orderDetails),
      deliveryDetails: getSafeDeliveryDetails(orderDetails),
      lineItems: getSafeLineItems(orderDetails),
      orderLogs: getSafeOrderLogs(orderDetails),
      taskLogs: getSafeTaskLogs(orderDetails),
      instructions: getSafeInstructions(orderDetails)
    }
  }, [orderDetails])

  // Handlers
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen)
  const handleSidebarClose = () => setSidebarOpen(false)
  
  const handleRetry = () => {
    clearErrors()
    refreshOrderDetails()
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Orders", href: "/orders" },
    { label: transactionId || orderId }
  ]

  return {
    // UI State
    sidebarOpen,
    activeTab,
    
    // Data State
    orderDetails,
    safeData,
    isOverallLoading,
    isRefreshing,
    hasError,
    errorMessage,
    isEmpty,
    
    // Order Info
    transactionId,
    orderStatus,
    serviceType,
    shippingStatus,
    
    // Pallet Labels
    palletLabelsData,
    palletLabelsError,
    palletLabelsLoading,
    
    // Computed
    breadcrumbItems,
    
    // Handlers
    handleTabChange,
    handleSidebarToggle,
    handleSidebarClose,
    handleRetry,
    refreshOrderDetails,
    clearErrors
  }
}
