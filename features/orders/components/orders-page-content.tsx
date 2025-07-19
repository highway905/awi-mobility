"use client"

import { memo, ReactNode } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { OrdersFilter } from "./orders-filter"
import { AdvancedTable } from "@/features/shared/components/advanced-table"
import { GlobalLoader, GlobalErrorFallback } from "@/components/shared"
import { FilterSheet } from "./filter-sheet"
import { ColumnCustomizationSheet } from "./column-customization-sheet"
import { useOrdersPage } from "../hooks/useOrdersPage"
import { OrderTab } from "../types/order.types"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface OrdersPageLayoutProps {
  sidebarOpen: boolean
  onSidebarClose: () => void
  onMenuClick: () => void
  breadcrumbItems: Array<{ label: string; href?: string }>
  children: ReactNode
}

interface OrdersFilterSectionProps {
  currentTab: OrderTab
  onTabChange: (tab: OrderTab) => void
  searchQueryState: string
  onSearchChange: (query: string) => void
  dateRange: any
  onDateRangeChange: (range: any) => void
  filter: any
  onFilterChange: (filter: any) => void
  onAdvancedFiltersClick: () => void
  onColumnCustomizationClick: () => void
}

interface OrdersErrorDisplayProps {
  errorMessage?: string
  onRetry: () => void
}

interface OrdersTableSectionProps {
  shouldVirtualize: boolean
  virtualizedOrders: any[]
  tableData: any[]
  columns: any[]
  onRowClick: (row: any) => void
  isTableLoading: boolean
  emptyMessage: string
  tableSorting: any
  onSortingChange: (sorting: any) => void
  hasNextPage: boolean
  fetchNextPage: () => void
  isFetchingNextPage: boolean
}

interface OrdersSheetsContainerProps {
  activeSheet: string | null
  onCloseSheet: () => void
  onFiltersApply: (filters: any) => void
  memoizedInitialFilters: any
  customers: any[]
  isLoadingCustomers: boolean
}

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================

const OrdersPageLayout = memo(function OrdersPageLayout({
  sidebarOpen,
  onSidebarClose,
  onMenuClick,
  breadcrumbItems,
  children
}: OrdersPageLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={onSidebarClose} />
      
      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader 
          title="Orders" 
          breadcrumbItems={breadcrumbItems} 
          onMenuClick={onMenuClick} 
        />
      </div>
      
      {children}
    </div>
  )
})

// ============================================================================
// FILTER SECTION COMPONENT
// ============================================================================

const OrdersFilterSection = memo(function OrdersFilterSection({
  currentTab,
  onTabChange,
  searchQueryState,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  filter,
  onFilterChange,
  onAdvancedFiltersClick,
  onColumnCustomizationClick
}: OrdersFilterSectionProps) {
  return (
    <div className="flex-shrink-0 px-4 mb-4">
      <OrdersFilter
        activeTab={currentTab}
        onTabChange={onTabChange}
        searchQuery={searchQueryState}
        onSearchChange={onSearchChange}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filter={filter}
        onFilterChange={onFilterChange}
        onAdvancedFiltersClick={onAdvancedFiltersClick}
        onColumnCustomizationClick={onColumnCustomizationClick}
      />
    </div>
  )
})

// ============================================================================
// ERROR DISPLAY COMPONENT
// ============================================================================

const OrdersErrorDisplay = memo(function OrdersErrorDisplay({
  errorMessage,
  onRetry
}: OrdersErrorDisplayProps) {
  if (!errorMessage) return null

  return (
    <div className="flex-shrink-0 px-4 mb-2">
      <GlobalErrorFallback 
        variant="inline"
        error={errorMessage}
        onRetry={onRetry}
        showRetry={true}
      />
    </div>
  )
})

// ============================================================================
// TABLE SECTION COMPONENT
// ============================================================================

const OrdersTableSection = memo(function OrdersTableSection({
  shouldVirtualize,
  virtualizedOrders,
  tableData,
  columns,
  onRowClick,
  isTableLoading,
  emptyMessage,
  tableSorting,
  onSortingChange,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
}: OrdersTableSectionProps) {
  return (
    <div className="flex-1 px-4 pb-4 min-h-0 overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
        <AdvancedTable.Root
          data={shouldVirtualize ? virtualizedOrders : tableData}
          columns={columns}
          onRowClick={onRowClick}
          stickyColumns={{ left: ['transactionId'], right: [] }}
          isLoading={isTableLoading}
          emptyMessage={emptyMessage}
          sorting={tableSorting}
          onSortingChange={onSortingChange}
          manualSorting={true}
        >
          <AdvancedTable.Container
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          >
            <AdvancedTable.Table>
              <AdvancedTable.Header />
              <AdvancedTable.Body />
            </AdvancedTable.Table>
          </AdvancedTable.Container>
        </AdvancedTable.Root>
      </div>
    </div>
  )
})

// ============================================================================
// SHEETS CONTAINER COMPONENT
// ============================================================================

const OrdersSheetsContainer = memo(function OrdersSheetsContainer({
  activeSheet,
  onCloseSheet,
  onFiltersApply,
  memoizedInitialFilters,
  customers,
  isLoadingCustomers
}: OrdersSheetsContainerProps) {
  return (
    <>
      {/* Enhanced Filter Sheet - Only render when active */}
      {activeSheet === "filter" && (
        <FilterSheet
          isOpen={true}
          onClose={onCloseSheet}
          onFiltersApply={onFiltersApply}
          initialFilters={memoizedInitialFilters}
          customers={customers}
          isLoadingCustomers={isLoadingCustomers}
        />
      )}
      
      {/* Column customization disabled - sheet not needed */}
    </>
  )
})

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrdersPageContent() {
  // Use the consolidated custom hook
  const {
    // UI State
    sidebarOpen,
    activeSheet,
    
    // Data State
    orders,
    totalCount,
    hasNextPage,
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
    fetchNextPage,
    handleSidebarToggle,
    handleSidebarClose,
    handleOpenFilterSheet,
    handleOpenColumnSheet,
    handleCloseSheet,
    handleFiltersApply,
    clearErrors,
    
    // Loading States
    loadingStates,
  } = useOrdersPage()

  // Don't render table until hydrated (prevents SSR mismatches)
  if (!isBrowser || !filterHydrated || !tabHydrated) {
    return <GlobalLoader variant="fullscreen" message="Initializing orders..." />
  }

  return (
    <OrdersPageLayout
      sidebarOpen={sidebarOpen}
      onSidebarClose={handleSidebarClose}
      onMenuClick={handleSidebarToggle}
      breadcrumbItems={breadcrumbItems}
    >
      <OrdersFilterSection
        currentTab={currentTab}
        onTabChange={handleTabChange}
        searchQueryState={searchQueryState}
        onSearchChange={handleSearchChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        filter={filter}
        onFilterChange={handleFilterUpdate}
        onAdvancedFiltersClick={handleOpenFilterSheet}
        onColumnCustomizationClick={handleOpenColumnSheet}
      />

      <OrdersErrorDisplay
        errorMessage={errorMessage}
        onRetry={clearErrors}
      />

      <OrdersTableSection
        shouldVirtualize={shouldVirtualize}
        virtualizedOrders={virtualizedOrders}
        tableData={tableData}
        columns={columns}
        onRowClick={handleRowClick}
        isTableLoading={isTableLoading}
        emptyMessage={emptyMessage}
        tableSorting={tableSorting}
        onSortingChange={handleSortChange}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={loadingStates.loadingMore}
      />

      <OrdersSheetsContainer
        activeSheet={activeSheet}
        onCloseSheet={handleCloseSheet}
        onFiltersApply={handleFiltersApply}
        memoizedInitialFilters={memoizedInitialFilters}
        customers={customers}
        isLoadingCustomers={isLoadingCustomers}
      />
    </OrdersPageLayout>
  )
}
