import { useState, useMemo } from "react"
import { useGetOrderListQuery } from "@/lib/redux/api/orderManagement"
import type { Order } from "../types/order.types"

export function useOrdersPageSimple() {
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // API call
  const { data: ordersResponse, isLoading, error } = useGetOrderListQuery({
    searchKey: "",
    sortColumn: "transactionId",
    sortDirection: "asc",
    pageIndex: 1,
    pageSize: 50,
  })

  // Processed data
  const orders: Order[] = useMemo(() => {
    return ordersResponse?.result?.orders || []
  }, [ordersResponse])

  const totalCount = ordersResponse?.result?.totalCount || 0

  // Handlers
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen)
  const handleSidebarClose = () => setSidebarOpen(false)

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" }, 
    { label: "Order Management" }
  ]

  return {
    // UI State
    sidebarOpen,
    
    // Data
    orders,
    totalCount,
    isLoading,
    error,
    
    // Computed
    breadcrumbItems,
    
    // Handlers
    handleSidebarToggle,
    handleSidebarClose,
  }
}
