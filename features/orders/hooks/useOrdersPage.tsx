import { useState, useCallback, useEffect, useMemo } from "react"
import type React from "react"
import { useSearchParams } from "next/navigation"
import { useGetOrderListQuery } from "@/lib/redux/api/orderManagement"
import { useToast } from "@/hooks/use-toast"

// Import types
import type { Order, OrderTab } from "../types/order.types"

// Import utilities
import { getStatusStyle, getChannelStyle, getOrderTypeStyle } from "../utils/order.utils"

// Import existing hooks
import {
  useOrderFilterStorage,
  useOrderTabStorage,
  useOrderFilters,
  useLoadingStates,
  useErrorStates,
  useOrdersData,
  useOrderNavigation,
  useOrderApiProcessor,
  useStableApiPayload,
  useIsBrowser,
} from "./useOrderHooks"

import { useColumnCustomization } from "./useColumnCustomization"
import { useAdvancedFilters } from "./useAdvancedFilters"
import { useBulkActions as useEnhancedBulkActions, createOrderBulkActions } from "./useBulkActions"
import { useVirtualScroll } from "./useVirtualScrollSimple"
import { useCustomerCache } from "@/hooks/useCustomerCache"
import type { AdvancedTableColumn } from "@/components/shared/advanced-table"

// Define sheet types for better type safety
type SheetType = "filter" | "column" | null

export function useOrdersPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("search") || ""
  
  // Browser detection for SSR safety
  const isBrowser = useIsBrowser()
  const { navigateToOrder } = useOrderNavigation()
  const { toast } = useToast()

  // UI State - Use single state to ensure only one sheet is open at a time
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)

  // Enhanced hooks for full feature integration
  const columnCustomization = useColumnCustomization("orders")
  const advancedFilters = useAdvancedFilters()
  const enhancedBulkActions = useEnhancedBulkActions<Order>()
  const { customers, isLoading: isLoadingCustomers } = useCustomerCache()

  // Persistent state with custom hooks (SSR-safe)
  const {
    filter: storedFilter,
    setFilter: setStoredFilter,
    isHydrated: filterHydrated,
  } = useOrderFilterStorage(searchQuery)
  const { currentTab, setCurrentTab, isHydrated: tabHydrated } = useOrderTabStorage()

  // State management hooks
  const { loadingStates, updateLoadingState } = useLoadingStates()
  const { errorStates, setError, clearErrors } = useErrorStates()
  const { orders, hasNextPage, totalCount, updateOrders, updatePagination } = useOrdersData()

  // Filter management with debouncing
  const {
    filter,
    dateRange,
    searchQuery: searchQueryState,
    handleFilterUpdate,
    handleTabChange: handleTabChangeFromHook,
    handleSearchChange,
    handleDateRangeChange,
  } = useOrderFilters(storedFilter, (updates) => {
    if (filterHydrated) {
      const newFilter = { ...storedFilter, ...updates }
      setStoredFilter(newFilter)
    }
  })

  // Enhanced tab change handler
  const handleTabChange = useCallback(
    (tab: OrderTab) => {
      if (tabHydrated) {
        setCurrentTab(tab)
        handleTabChangeFromHook(tab)
      }
    },
    [setCurrentTab, handleTabChangeFromHook, tabHydrated],
  )

  // Simplified sorting management
  const handleSortChange = useCallback(
    (sorting: any[]) => {
      if (sorting.length > 0) {
        const { id, desc } = sorting[0]
        handleFilterUpdate({
          sortColumn: id,
          sortDirection: desc ? "desc" : "asc",
          pageIndex: 1,
        })
      } else {
        handleFilterUpdate({
          sortColumn: "transactionId",
          sortDirection: "asc",
          pageIndex: 1,
        })
      }
    },
    [handleFilterUpdate],
  )

  // Table sorting state
  const tableSorting = useMemo(() => {
    const sortColumn = filter.sortColumn || "transactionId"
    const sortDirection = filter.sortDirection === "desc" ? "desc" : "asc"
    return [{ id: sortColumn, desc: sortDirection === "desc" }]
  }, [filter.sortColumn, filter.sortDirection])

  // Enhanced column customization
  const {
    visibleColumns,
    stickyColumns,
    isLoading: isColumnLoading,
    isDirty: hasUnsavedColumns,
    toggleColumn,
    reorderColumns,
    updateColumnWidth,
    pinColumn,
    resetColumns,
    saveColumns,
  } = columnCustomization

  // Enhanced bulk actions
  const {
    selectedItems,
    selectedCount,
    isLoading: isBulkLoading,
    actionProgress,
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    executeBulkAction: performBulkAction,
    isSelected,
    getSelectedItems,
    isAllSelected,
    isSomeSelected,
  } = enhancedBulkActions

  // Virtual scrolling for large datasets
  const {
    shouldVirtualize,
    visibleItems: virtualizedOrders,
    scrollElementRef,
    handleScroll,
    getContainerStyle,
    getInnerStyle,
    scrollToTop,
  } = useVirtualScroll(orders, {
    itemHeight: 60,
    containerHeight: 600,
    threshold: 500,
  })

  // Create bulk actions
  const bulkActions = useMemo(
    () =>
      createOrderBulkActions(() => {
        window.location.reload()
      }),
    [],
  )

  // API integration
  const { processOrderResponse } = useOrderApiProcessor()

  // Create stable API payload (only when hydrated)
  const apiPayload = useStableApiPayload(filterHydrated ? filter : storedFilter, tabHydrated ? currentTab : "all")

  // API query with proper hydration check
  const {
    data: ordersResponse,
    isFetching,
    isLoading,
    refetch,
    error: apiError,
  } = useGetOrderListQuery(apiPayload, {
    refetchOnMountOrArgChange: true,
    skip: !isBrowser || !filterHydrated || !tabHydrated,
  })

  // Memoized table columns with customization support
  const columns: AdvancedTableColumn<Order>[] = useMemo(() => {
    const baseColumns = [
      {
        key: "transactionId",
        header: "Transaction ID",
        render: (value: string) => (
          <span className="font-medium text-blue-600 cursor-pointer hover:text-blue-800 transition-colors">
            {value}
          </span>
        ),
        sortable: true,
        minWidth: 140,
      },
      {
        key: "customer",
        header: "Customer",
        render: (value: string) => <span className="text-gray-900 font-medium">{value}</span>,
        sortable: true,
        minWidth: 136,
      },
      {
        key: "orderType",
        header: "Order Type",
        render: (value: string) => (
          <span className={` text-gray-700 `}>{value}</span>
        ),
        sortable: true,
        minWidth: 110,
      },
      {
        key: "referenceId",
        header: "Reference ID",
        render: (value: string) => <span className="text-gray-700">{value}</span>,
        sortable: true,
        minWidth: 136,
      },
      {
        key: "channel",
        header: "Channel",
        render: (value: string) => (
          <span className={`text-gray-700`}>{value}</span>
        ),
        sortable: true,
        minWidth: 110,
      },
      {
        key: "appointmentDate",
        header: "Appointment Date",
        render: (value: string) => <span className="text-gray-700">{value}</span>,
        sortable: true,
        minWidth: 160,
      },
      {
        key: "status",
        header: "Status",
        render: (value: string) => (
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(value as any)}`}>
            {value}
          </span>
        ),
        sortable: true,
        minWidth: 140,
      },
    ]

    if (visibleColumns.length > 0) {
      return baseColumns
        .filter((col) => visibleColumns.some((visibleCol) => visibleCol.id === col.key))
        .map((col) => {
          const customCol = visibleColumns.find((visibleCol) => visibleCol.id === col.key)
          return {
            ...col,
            width: customCol?.width || col.minWidth,
          }
        })
    }

    return baseColumns
  }, [visibleColumns])

  // Process API response when data changes
  useEffect(() => {
    if (ordersResponse) {
      clearErrors()
      const currentPage = filterHydrated ? filter.pageIndex : 1

      try {
        const {
          orders: newOrders,
          totalCount: newTotal,
          isFirstPage,
        } = processOrderResponse(ordersResponse, currentPage)

        if (newOrders.length > 0) {
          updateOrders(newOrders, isFirstPage, newTotal)
          updatePagination(currentPage, filter.pageSize, newTotal)
        }
      } catch (error) {
        setError("loadError", "Failed to process order data")
      }
    }
  }, [
    ordersResponse,
    filter.pageIndex,
    filter.pageSize,
    processOrderResponse,
    updateOrders,
    updatePagination,
    clearErrors,
    filterHydrated,
    setError,
    apiError,
  ])

  // Handle API errors
  useEffect(() => {
    if (apiError) {
      setError("loadError", "Failed to load orders. Please try again.")
    }
  }, [apiError, setError])

  // Infinite scroll handler
  const fetchNextPage = useCallback(async () => {
    if (loadingStates.loadingMore || !hasNextPage || isFetching) return

    updateLoadingState("loadingMore", true)

    try {
      handleFilterUpdate({
        pageIndex: filter.pageIndex + 1,
      })
    } finally {
      updateLoadingState("loadingMore", false)
    }
  }, [loadingStates.loadingMore, hasNextPage, isFetching, updateLoadingState, handleFilterUpdate, filter.pageIndex])

  // Handle bulk actions with enhanced version
  const handleBulkAction = useCallback(
    async (actionId: string, selectedRows: Order[]) => {
      updateLoadingState("saving", true)

      try {
        const action = bulkActions.find((a: { id: string }) => a.id === actionId)
        if (action) {
          await performBulkAction(action, selectedRows)
        }
      } catch (error) {
        setError("saveError", "Bulk action failed. Please try again.")
      } finally {
        updateLoadingState("saving", false)
      }
    },
    [updateLoadingState, setError, bulkActions, performBulkAction],
  )

  // Row click handler with proper navigation
  const handleRowClick = useCallback(
    (order: Order) => {
      navigateToOrder(order.orderId)
    },
    [navigateToOrder],
  )

  // Memoize initial filters to prevent infinite loops
  const memoizedInitialFilters = useMemo(() => {
    return {
      referenceId: filter.referenceId,
      transactionId: filter.transactionId,
      customerId: filter.customerId,
      orderTypes: filter.orderTypes,
      statuses: filter.statuses,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
    }
  }, [
    filter.referenceId,
    filter.transactionId,
    filter.customerId,
    filter.orderTypes,
    filter.statuses,
    filter.fromDate,
    filter.toDate,
  ])

  // SHEET HANDLERS - Ensure only one sheet is open at a time
  const handleOpenFilterSheet = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setActiveSheet("filter")
  }, [])

  const handleOpenColumnSheet = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setActiveSheet("column")
  }, [])

  const handleCloseSheet = useCallback(() => {
    setActiveSheet(null)
  }, [])

  const handleFiltersApply = useCallback(
    (filters: any) => {
      // Apply filters synchronously
      handleFilterUpdate({
        ...filters,
        pageIndex: 1,
      })

      // Close sheet immediately
      setActiveSheet(null)

      // Show success message
      toast({
        title: "Filters Applied",
        description: "Your filters have been applied successfully.",
      })
    },
    [handleFilterUpdate, toast],
  )

  // Enhanced loading state for different scenarios
  const isInitialLoading = isLoading && orders.length === 0
  const isRefetching = isFetching && orders.length > 0

  // Error message to display
  const errorMessage = errorStates.loadError || errorStates.networkError

  // Loading strategy for table
  const isTableLoading = isFetching && (orders.length === 0 || filter.pageIndex === 1)
  const tableData = isTableLoading && filter.pageIndex === 1 && orders.length > 0 ? [] : orders

  // Empty message based on state
  const emptyMessage = useMemo(() => {
    if (isInitialLoading) return "Loading orders..."
    if (errorMessage) return errorMessage
    if (isFetching && orders.length === 0) return "Fetching orders..."
    return "No orders found matching your criteria"
  }, [isInitialLoading, errorMessage, isFetching, orders.length])

  // Breadcrumb items
  const breadcrumbItems = [{ label: "Home", href: "/dashboard" }, { label: "Order Management" }]

  // Sidebar handlers
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen)
  const handleSidebarClose = () => setSidebarOpen(false)

  return {
    // UI State
    sidebarOpen,
    activeSheet,
    
    // Data State
    orders,
    totalCount,
    hasNextPage,
    isInitialLoading,
    isRefetching,
    isTableLoading,
    tableData,
    errorMessage,
    emptyMessage,
    
    // Filter State
    filter,
    dateRange,
    searchQueryState,
    currentTab,
    filterHydrated,
    tabHydrated,
    isBrowser,
    
    // Table Configuration
    columns,
    tableSorting,
    stickyColumns,
    shouldVirtualize,
    virtualizedOrders,
    
    // Bulk Actions
    selectedItems,
    selectedCount,
    isBulkLoading,
    bulkActions,
    
    // Column Customization
    visibleColumns,
    isColumnLoading,
    hasUnsavedColumns,
    
    // Customer Data
    customers,
    isLoadingCustomers,
    
    // Computed
    breadcrumbItems,
    memoizedInitialFilters,
    
    // Handlers
    handleTabChange,
    handleSearchChange,
    handleDateRangeChange,
    handleFilterUpdate,
    handleSortChange,
    handleRowClick,
    handleBulkAction,
    fetchNextPage,
    handleSidebarToggle,
    handleSidebarClose,
    handleOpenFilterSheet,
    handleOpenColumnSheet,
    handleCloseSheet,
    handleFiltersApply,
    clearErrors,
    
    // Column Customization Methods
    toggleColumn,
    reorderColumns,
    updateColumnWidth,
    pinColumn,
    resetColumns,
    saveColumns,
    
    // Loading States
    loadingStates,
    updateLoadingState,
  }
}
