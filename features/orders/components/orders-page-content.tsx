"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { OrdersFilter } from "./orders-filter"
import { AdvancedTable } from "@/features/shared/components/advanced-table"
import { GlobalLoader, GlobalErrorFallback } from "@/components/shared"
import { FilterSheet } from "./filter-sheet"
import { ColumnCustomizationSheet } from "./column-customization-sheet"
import { useOrdersPage } from "../hooks/useOrdersPage"

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

  // Orders page content

  // Don't render table until hydrated (prevents SSR mismatches)
  if (!isBrowser || !filterHydrated || !tabHydrated) {
    return <GlobalLoader variant="fullscreen" message="Initializing orders..." />
  }

  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader title="Orders" breadcrumbItems={breadcrumbItems} onMenuClick={handleSidebarToggle} />
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
          onAdvancedFiltersClick={handleOpenFilterSheet}
          onColumnCustomizationClick={handleOpenColumnSheet}
        />
      </div>

      {/* Error Display */}
      {errorMessage && (
        <div className="flex-shrink-0 px-4 mb-2">
          <GlobalErrorFallback 
            variant="inline"
            error={errorMessage}
            onRetry={clearErrors}
            showRetry={true}
          />
        </div>
      )}

      {/* Flexible Table Section - Takes remaining space with proper height constraints */}
      <div className="flex-1 px-4 pb-4 min-h-0 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
          <AdvancedTable.Root
            data={shouldVirtualize ? virtualizedOrders : tableData}
            columns={columns}
            onRowClick={handleRowClick}
            stickyColumns={{ left: ['transactionId'], right: [] }}
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
          </AdvancedTable.Root>
        </div>
      </div>

      {/* Enhanced Filter Sheet - Only render when active */}
      {activeSheet === "filter" && (
        <FilterSheet
          isOpen={true}
          onClose={handleCloseSheet}
          onFiltersApply={handleFiltersApply}
          initialFilters={memoizedInitialFilters}
          customers={customers}
          isLoadingCustomers={isLoadingCustomers}
        />
      )}

      {/* Column customization disabled - sheet not needed */}
    </div>
  )
}
