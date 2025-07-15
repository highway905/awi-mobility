"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { OrdersFilter } from "./orders-filter"
import { AdvancedTable } from "@/components/shared/advanced-table"
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errorMessage}
            <button onClick={clearErrors} className="ml-2 text-red-500 hover:text-red-700">
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
        </AdvancedTable.Root>
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

      {/* Enhanced Column Customization Sheet - Only render when active */}
      {activeSheet === "column" && (
        <ColumnCustomizationSheet
          isOpen={true}
          onClose={handleCloseSheet}
          onColumnsChange={(columns) => {
            // Handle columns change if needed
          }}
          onSaveColumns={async (columns) => {
            // Column saving logic would be handled here
            // For now, just close the sheet
            handleCloseSheet()
          }}
          onResetColumns={() => {
            // Column reset logic would be handled here
            handleCloseSheet()
          }}
          columns={[]}
          isLoading={false}
          error={null}
        />
      )}
    </div>
  )
}
