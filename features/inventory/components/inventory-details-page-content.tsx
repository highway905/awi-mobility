"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { AdvancedTable, type AdvancedTableColumn } from "@/features/shared/components/advanced-table"
import { GlobalErrorFallback } from "@/components/shared"
import { CustomerDetailsCard } from "./customer-details-card"
import { useInventoryDetails, type TransactionHistory } from "../hooks/use-inventory-details"
import { DetailsCardSkeleton } from "./details-card-skeleton"

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Inventory Management", href: "/inventory" },
  { label: "Real Time Inventory", href: "/inventory" },
]

export function InventoryDetailsPageContent() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const {
    sku,
    inventoryAllocationId,
    inventoryDetails,
    transactions,
    hasNextPage,
    fetchNextPage,
    isInitialLoading,
    isTransactionsLoading,
    inventoryError,
    hasInventoryLoaded,
    hasTransactionsLoaded,
  } = useInventoryDetails()

  // Business Actions
  const handleBulkAction = useCallback(async (action: string, selectedRows: TransactionHistory[]) => {
    const transactionIds = selectedRows.map(({ id }) => id)

    try {
      switch (action) {
        case "export":
          console.log("Exporting transactions:", transactionIds)
          break
        case "view-details":
          console.log("Viewing details for transactions:", transactionIds)
          break
        default:
          console.log("Bulk action:", action, selectedRows)
      }
    } catch (error) {
      console.error("Bulk action failed:", error)
    }
  }, [])

  const handleTransactionClick = useCallback(
    ({ transactionId }: TransactionHistory) => {
      if (transactionId && transactionId !== "N/A") {
        router.push(`/order-details/${transactionId}`)
      }
    },
    [router],
  )

  const handleFetchNextPage = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return

    setIsLoadingMore(true)
    try {
      await fetchNextPage()
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasNextPage, fetchNextPage])

  // Table Configuration
  const columns: AdvancedTableColumn<TransactionHistory>[] = useMemo(
    () => [
      {
        key: "dateTime",
        header: "Date & Time",
        render: (value: string) => (
          <div className="font-medium text-gray-900 truncate" title={value}>
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 160,
        sticky: "left",
      },
      {
        key: "type",
        header: "Type",
        render: (value: string) => (
          <div className="truncate" title={value}>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                value.includes("Inbound") || value.includes("Moving In")
                  ? "bg-green-100 text-green-800"
                  : value.includes("Outbound")
                    ? "bg-blue-100 text-blue-800"
                    : value.includes("Adjustment")
                      ? "bg-yellow-100 text-yellow-800"
                      : value.includes("Reserved")
                        ? "bg-orange-100 text-orange-800"
                        : value.includes("Unreserved")
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
              }`}
            >
              {value}
            </span>
          </div>
        ),
        sortable: true,
        minWidth: 140,
      },
      {
        key: "transactionId",
        header: "Transaction ID",
        render: (value: string) => (
          <div className="font-medium text-blue-600 truncate" title={value}>
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 140,
      },
      {
        key: "referenceId",
        header: "Reference ID",
        render: (value: string) => (
          <div className="text-gray-700 truncate" title={value}>
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 140,
      },
      {
        key: "location",
        header: "Location",
        render: (value: string) => (
          <div className="text-gray-700 truncate" title={value}>
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 120,
      },
      {
        key: "inbound",
        header: "Inbound",
        render: (value: number) => (
          <div className="">
            <span className="font-medium">
              {value}
            </span>
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "outbound",
        header: "Outbound",
        render: (value: number) => (
          <div className="">
            <span className="font-medium ">
              {value}
            </span>
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "adjustment",
        header: "Adjustment",
        render: (value: number) => (
          <div className="">
            <span
              className={`font-medium`}
            >
              {value}
            </span>
          </div>
        ),
        sortable: true,
        minWidth: 110,
      },
    ],
    [],
  )

  // Calculate footer data
  const footerData = useMemo(() => {
    return {
      dateTime: `Total: ${transactions.length} transactions`,
      type: '',
      transactionId: '',
      referenceId: '',
      location: '',
      inbound: transactions.reduce((sum, t) => sum + (t.inbound || 0), 0),
      outbound: transactions.reduce((sum, t) => sum + (t.outbound || 0), 0),
      adjustment: transactions.reduce((sum, t) => sum + (t.adjustment || 0), 0),
    }
  }, [transactions])

  // Determine loading states - Fixed race condition
  const isTableLoading = isTransactionsLoading || (!hasTransactionsLoaded && !inventoryError)
  const showEmptyState = hasTransactionsLoaded && !isTransactionsLoading && transactions.length === 0
  const isDataLoading = isInitialLoading || isTransactionsLoading || !hasTransactionsLoaded

  // Get appropriate empty message - Fixed to handle race conditions
  const getEmptyMessage = () => {
    if (isDataLoading || isTransactionsLoading) return "Loading transaction history..."
    if (showEmptyState) return "No transaction history found"
    return "Loading transaction history..."
  }

  // Error handling
  if (!inventoryAllocationId) {
    return (
      <div className="h-screen flex flex-col bg-dashboard-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <GlobalErrorFallback
            variant="card"
            title="Invalid Request"
            description="No inventory allocation ID provided. Please check the URL and try again."
            showRetry={false}
            showBack={true}
            onBack={() => window.history.back()}
          />
        </div>
      </div>
    )
  }

  // Show error state
  if (inventoryError) {
    return (
      <div className="h-screen flex flex-col bg-dashboard-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <GlobalErrorFallback
            variant="card"
            title="Failed to load inventory details"
            description="We encountered an error while loading the inventory details. Please try again."
            onRetry={() => window.location.reload()}
            showRetry={true}
          />
        </div>
      </div>
    )
  }

  // Show initial loading screen if nothing has loaded yet - Fixed race condition
  if (isInitialLoading && !hasInventoryLoaded && !hasTransactionsLoaded) {
    return (
      <div className="h-screen flex flex-col bg-dashboard-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            Loading inventory details...
          </div>
        </div>
      </div>
    )
  }

  // Render main content - FIXED: Exact same structure as inventory page
  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader
          title={`${inventoryDetails?.sku || sku} ${inventoryDetails?.name ? `(${inventoryDetails.name})` : ""}`}
          breadcrumbItems={[...breadcrumbItems, { label: inventoryDetails?.sku || sku }]}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Content - FIXED: Exact same structure as inventory page */}
      <div className="flex-1 px-4 pb-2 min-h-0">
        {/* Customer Details Card - Fixed race condition */}
        {isInitialLoading && !hasInventoryLoaded ? (
          <div className="mb-4">
            <DetailsCardSkeleton />
          </div>
        ) : inventoryDetails ? (
          <div className="mb-4">
            <CustomerDetailsCard details={inventoryDetails} />
          </div>
        ) : hasInventoryLoaded && !inventoryDetails && !inventoryError ? (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">Inventory details not available</p>
          </div>
        ) : null}

        {/* Transaction History Table - FIXED: Proper height constraints and race condition handling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 240px)' }}>
          {/* Show loading state if still fetching initial data */}
          {isInitialLoading && !hasTransactionsLoaded ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500 flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Loading transaction history...
              </div>
            </div>
          ) : (
            <AdvancedTable.Root
              data={transactions}
              columns={columns}
              onRowClick={handleTransactionClick}
              enableBulkSelection={true}
              onBulkAction={handleBulkAction}
              stickyColumns={{
                left: [],
                right: []
              }}
              isLoading={isTableLoading}
              emptyMessage={getEmptyMessage()}
              className="h-full"
            >
              <div className="flex flex-col h-full">
                <AdvancedTable.Container
                  hasNextPage={hasNextPage}
                  fetchNextPage={handleFetchNextPage}
                  isFetchingNextPage={isLoadingMore}
                  className="flex-1 min-h-0"
                >
                  <AdvancedTable.Table>
                    <AdvancedTable.Header />
                    <AdvancedTable.Body />
                  </AdvancedTable.Table>
                </AdvancedTable.Container>
                {/* <AdvancedTable.Footer footerData={footerData} /> */}
              </div>
            </AdvancedTable.Root>
          )}
        </div>
      </div>
    </div>
  )
}