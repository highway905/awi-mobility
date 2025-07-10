"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { OrdersFilter } from "./orders-filter"
import { AdvancedTable, type AdvancedTableColumn } from "@/components/shared/advanced-table"
import { useGetOrderListQuery } from "@/lib/redux/api/orderManagement"

// Import types
import type { Order, OrderTab, DateRange } from '../types/order.types'

// Import utilities
import {
  getStatusStyle,
  getChannelStyle,
  getOrderTypeStyle,
} from '../utils/order.utils'

// Import custom hooks
import {
  useOrderFilterStorage,
  useOrderTabStorage,
  useOrderFilters,
  useLoadingStates,
  useErrorStates,
  useOrdersData,
  useOrderNavigation,
  useBulkActions,
  useOrderApiProcessor,
  useStableApiPayload,
  useIsBrowser,
} from '../hooks/useOrderHooks'

// Import new enhanced hooks
import { useColumnCustomization } from '../hooks/useColumnCustomization'
import { useAdvancedFilters } from '../hooks/useAdvancedFilters'
import { useBulkActions as useEnhancedBulkActions, createOrderBulkActions } from '../hooks/useBulkActions'
import { useVirtualScroll } from '../hooks/useVirtualScrollSimple'

// Import enhanced UI components
import { FilterSheet } from './filter-sheet'
import { ColumnCustomizationSheet } from './column-customization-sheet'

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" }, 
  { label: "Order Management" }
]

/**
 * Main Orders Page Component with Enhanced Features
 */
export function OrdersPageContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get('search') || ''
  
  // Browser detection for SSR safety
  const isBrowser = useIsBrowser()

  // Navigation hooks
  const { navigateToOrder } = useOrderNavigation()

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [showColumnSheet, setShowColumnSheet] = useState(false)

  // Enhanced hooks for full feature integration
  const columnCustomization = useColumnCustomization('orders')
  const advancedFilters = useAdvancedFilters()
  const enhancedBulkActions = useEnhancedBulkActions<Order>()

  // Persistent state with custom hooks (SSR-safe)
  const { filter: storedFilter, setFilter: setStoredFilter, isHydrated: filterHydrated } = useOrderFilterStorage(searchQuery)
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
  const handleTabChange = useCallback((tab: OrderTab) => {
    if (tabHydrated) {
      setCurrentTab(tab)
      handleTabChangeFromHook(tab)
    }
  }, [setCurrentTab, handleTabChangeFromHook, tabHydrated])

  // Simplified sorting management
  const handleSortChange = useCallback((sorting: any[]) => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      handleFilterUpdate({
        sortColumn: id,
        sortDirection: desc ? 'desc' : 'asc',
        pageIndex: 1,
      })
    } else {
      handleFilterUpdate({
        sortColumn: 'transactionId',
        sortDirection: 'asc',
        pageIndex: 1,
      })
    }
  }, [handleFilterUpdate])

  // Table sorting state
  const tableSorting = useMemo(() => {
    const sortColumn = filter.sortColumn || 'transactionId'
    const sortDirection = filter.sortDirection === 'desc' ? 'desc' : 'asc'
    return [{ id: sortColumn, desc: sortDirection === 'desc' }]
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
    saveColumns
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
    isSomeSelected
  } = enhancedBulkActions

  // Virtual scrolling for large datasets
  const {
    shouldVirtualize,
    visibleItems: virtualizedOrders,
    scrollElementRef,
    handleScroll,
    getContainerStyle,
    getInnerStyle,
    scrollToTop
  } = useVirtualScroll(orders, {
    itemHeight: 60,
    containerHeight: 600,
    threshold: 500
  })

  // Create bulk actions
  const bulkActions = useMemo(() => 
    createOrderBulkActions(() => {
      // Refresh data after bulk action
      window.location.reload() // Simple refresh for now
    }), 
    []
  )

  // API integration
  const { processOrderResponse } = useOrderApiProcessor()

  // Create stable API payload (only when hydrated)
  const apiPayload = useStableApiPayload(
    filterHydrated ? filter : storedFilter, 
    tabHydrated ? currentTab : 'all'
  )

  // API query with proper hydration check
  const {
    data: ordersResponse,
    isFetching,
    isLoading,
    refetch,
    error: apiError
  } = useGetOrderListQuery(apiPayload, {
    refetchOnMountOrArgChange: true,
    skip: !isBrowser || !filterHydrated || !tabHydrated,
  })

  // Process API response when data changes
  useEffect(() => {
    if (ordersResponse) {
      clearErrors()
      
      const currentPage = filterHydrated ? filter.pageIndex : 1
      
      try {
        const { orders: newOrders, totalCount: newTotal, isFirstPage } = processOrderResponse(
          ordersResponse, 
          currentPage
        )
        
        if (newOrders.length > 0) {
          updateOrders(newOrders, isFirstPage, newTotal)
          updatePagination(currentPage, filter.pageSize, newTotal)
        }
      } catch (error) {
        setError('loadError', 'Failed to process order data');
      }
    }
  }, [ordersResponse, filter.pageIndex, filter.pageSize, processOrderResponse, updateOrders, updatePagination, clearErrors, filterHydrated, setError, apiError])

  // Handle API errors
  useEffect(() => {
    if (apiError) {
      setError('loadError', 'Failed to load orders. Please try again.')
    }
  }, [apiError, setError])

  // Infinite scroll handler
  const fetchNextPage = useCallback(async () => {
    if (loadingStates.loadingMore || !hasNextPage || isFetching) return
    
    updateLoadingState('loadingMore', true)
    
    try {
      handleFilterUpdate({
        pageIndex: filter.pageIndex + 1,
      })
    } finally {
      updateLoadingState('loadingMore', false)
    }
  }, [loadingStates.loadingMore, hasNextPage, isFetching, updateLoadingState, handleFilterUpdate, filter.pageIndex])

  // Handle bulk actions with enhanced version
  const handleBulkAction = useCallback(async (actionId: string, selectedRows: Order[]) => {
    updateLoadingState('saving', true)
    
    try {
      const action = bulkActions.find(a => a.id === actionId)
      if (action) {
        await performBulkAction(action, selectedRows)
      }
    } catch (error) {
      setError('saveError', 'Bulk action failed. Please try again.')
    } finally {
      updateLoadingState('saving', false)
    }
  }, [updateLoadingState, setError, bulkActions, performBulkAction])

  // Row click handler with proper navigation
  const handleRowClick = useCallback((order: Order) => {
    navigateToOrder(order.orderId)
  }, [navigateToOrder])

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
        render: (value: string) => (
          <span className="text-gray-900 font-medium">{value}</span>
        ),
        sortable: true,
        minWidth: 136,
      },
      {
        key: "orderType",
        header: "Order Type",
        render: (value: string) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderTypeStyle(value)}`}>
            {value}
          </span>
        ),
        sortable: true,
        minWidth: 110,
      },
      {
        key: "referenceId",
        header: "Reference ID",
        render: (value: string) => (
          <span className="text-gray-700">{value}</span>
        ),
        sortable: true,
        minWidth: 136,
      },
      {
        key: "channel",
        header: "Channel",
        render: (value: string) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelStyle(value)}`}>
            {value}
          </span>
        ),
        sortable: true,
        minWidth: 110,
      },
      {
        key: "appointmentDate",
        header: "Appointment Date",
        render: (value: string) => (
          <span className="text-gray-700">{value}</span>
        ),
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

    // Filter columns based on visibility settings
    if (visibleColumns.length > 0) {
      return baseColumns.filter(col => 
        visibleColumns.some(visibleCol => visibleCol.id === col.key)
      ).map(col => {
        const customCol = visibleColumns.find(visibleCol => visibleCol.id === col.key)
        return {
          ...col,
          width: customCol?.width || col.minWidth,
        }
      })
    }

    return baseColumns
  }, [visibleColumns])

  // Enhanced loading state for different scenarios
  const isInitialLoading = isLoading && orders.length === 0
  const isRefetching = isFetching && orders.length > 0

  // Error message to display
  const errorMessage = errorStates.loadError || errorStates.networkError

  // Loading strategy for table
  const isTableLoading = isFetching && (orders.length === 0 || filter.pageIndex === 1)
  const tableData = (isTableLoading && filter.pageIndex === 1 && orders.length > 0) ? [] : orders

  // Empty message based on state
  const emptyMessage = useMemo(() => {
    if (isInitialLoading) return "Loading orders..."
    if (errorMessage) return errorMessage
    if (isFetching && orders.length === 0) return "Fetching orders..."
    return "No orders found matching your criteria"
  }, [isInitialLoading, errorMessage, isFetching, orders.length])

  // Don't render table until hydrated (prevents SSR mismatches)
  if (!isBrowser || !filterHydrated || !tabHydrated) {
    return (
      <div className="h-screen flex flex-col bg-dashboard-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader
          title="Orders"
          breadcrumbItems={breadcrumbItems}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Fixed Filter Section */}
      <div className="flex-shrink-0 px-4 mb-4">
        <OrdersFilter
          activeTab={currentTab}
          onTabChange={handleTabChange}
          searchQuery={searchQueryState}
          onSearchChange={handleSearchChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          filter={filter}
          onFilterChange={handleFilterUpdate}
          onAdvancedFiltersClick={() => setShowFilterSheet(true)}
          onColumnCustomizationClick={() => setShowColumnSheet(true)}
        />
      </div>

      {/* Error Display */}
      {errorMessage && (
        <div className="flex-shrink-0 px-4 mb-2">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errorMessage}
            <button 
              onClick={clearErrors}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Flexible Table Section - Takes remaining space */}
      <div className="flex-1 px-4 pb-4 min-h-0">        
        <AdvancedTable.Root
          data={shouldVirtualize ? virtualizedOrders : tableData}
          columns={columns}
          onRowClick={handleRowClick}
          enableBulkSelection={true}
          onBulkAction={handleBulkAction}
          stickyColumns={stickyColumns}
          isLoading={isTableLoading}
          emptyMessage={emptyMessage}
          sorting={tableSorting}
          onSortingChange={handleSortChange}
          manualSorting={true}
        >
          <AdvancedTable.Container
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={loadingStates.loadingMore}
          >
            <AdvancedTable.Table>
              <AdvancedTable.Header />
              <AdvancedTable.Body />
            </AdvancedTable.Table>
          </AdvancedTable.Container>
          <AdvancedTable.BulkActions />
        </AdvancedTable.Root>
      </div>

      {/* Enhanced Filter Sheet */}
      <FilterSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onFiltersApply={(filters) => {
          // Apply advanced filters to main filter state
          handleFilterUpdate(filters)
          setShowFilterSheet(false)
        }}
      />

      {/* Enhanced Column Customization Sheet */}
      <ColumnCustomizationSheet
        isOpen={showColumnSheet}
        onClose={() => setShowColumnSheet(false)}
        onColumnsChange={(columns) => {
          // Columns are automatically managed by the hook
          console.log('Columns updated:', columns)
        }}
      />
    </div>
  )
}
