"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchWithCamera } from "@/components/ui/search-with-camera"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdvancedTable, type AdvancedTableColumn } from "@/features/shared/components/advanced-table"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { GlobalErrorFallback } from "@/components/shared"
import { InventoryEmptyState } from "./inventory-empty-state"
import { InventoryColumnCustomizationSheet } from "./inventory-column-customization-sheet"
import { InventoryFilterSheet } from "./inventory-filter-sheet"
import { useCustomerCache } from "@/hooks/useCustomerCache"
import { useInventoryData, type InventoryItem } from "../hooks/use-inventory-data"
import { isEmpty } from "lodash"
import type { SortingState } from "@tanstack/react-table"

const breadcrumbItems = [{ label: "Home", href: "/dashboard" }, { label: "Real Time Inventory" }]

export const filterToPayload = (filter: any) => {
  const payload = { ...filter }
  Object.entries(payload)?.forEach(([key, value]: [string, any]) => {
    if (Array.isArray(value)) payload[key] = value.map((v) => v?.id)
    else if (value?.id !== undefined) payload[key] = value?.id
  })
  return payload
}

export const inPast = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + 1 - n)
  return d
}

export const dateFrom = inPast(240)
dateFrom.setHours(0, 0, 0, 0)

export const dateCurrent = new Date()
dateCurrent.setHours(23, 59, 59, 999)

export const defaultInventoryFilter = {
  pageIndex: 1,
  pageSize: 20,
  searchKey: "",
  sortColumn: "",
  sortDirection: "",
  fromDate: dateFrom.toISOString(),
  toDate: dateCurrent.toISOString(),
  customerId: "",
  locationId: "",
  warehouseId: "",
  sku: "",
  palletId: "",
  status: "",
}

// Convert TanStack sorting to API format
const convertSortingToApiFormat = (sorting: SortingState) => {
  if (!sorting || sorting.length === 0) {
    return { sortColumn: "", sortDirection: "" }
  }
  
  const sort = sorting[0] // Take the first sort (single column sorting)
  return {
    sortColumn: sort.id,
    sortDirection: sort.desc ? "desc" : "asc"
  }
}

// Convert API format to TanStack sorting
const convertApiFormatToSorting = (sortColumn: string, sortDirection: string): SortingState => {
  if (!sortColumn || !sortDirection) {
    return []
  }
  
  return [{
    id: sortColumn,
    desc: sortDirection === "desc"
  }]
}

export function InventoryPageContent() {
  const { push } = useRouter()

  // Initialize from localStorage if available
  const [searchTrigger, setSearchTrigger] = useState(0)
  const storedFilter = typeof window !== "undefined" ? localStorage.getItem("inventoryListFilter") : null
  const parsedFilter = storedFilter ? JSON.parse(storedFilter) : null

  // Initialize filters state from localStorage
  const [filters, setFilters] = useState<any>(() => {
    if (!isEmpty(parsedFilter)) {
      return {
        customer: parsedFilter.customerId || "",
        search: parsedFilter.searchKey || "",
        skuSearch: parsedFilter.sku || "",
      }
    }
    return {
      customer: "",
      search: "",
      skuSearch: "",
    }
  })

  const [columnSheetOpen, setColumnSheetOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCustomerChanging, setIsCustomerChanging] = useState(false)
  const [previousCustomer, setPreviousCustomer] = useState<string>("")

  // Initialize filter state with sorting
  const [filter, setFilter] = useState<any>(() => {
    if (!isEmpty(parsedFilter)) {
      return { ...parsedFilter }
    }
    return { ...defaultInventoryFilter }
  })

  // Sorting state for the table
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (!isEmpty(parsedFilter) && parsedFilter.sortColumn && parsedFilter.sortDirection) {
      return convertApiFormatToSorting(parsedFilter.sortColumn, parsedFilter.sortDirection)
    }
    return []
  })

  // Client-side filters state (separate from server-side filters)
  const [clientFilters, setClientFilters] = useState({
    warehouse: "",
    location: "",
    sku: "",
    palletId: "",
  })

  // Use cached customer data - keep this enabled for the main customer dropdown
  const {
    customers: customerList,
    isLoading: isLoadingCustomers,
    isFetching: isFetchingCustomers,
    error: customerError,
    isUsingCache,
    refreshCache,
    cacheAge,
  } = useCustomerCache(true) // Always enabled for main page functionality

  // Sync customer selection after customers are loaded
  useEffect(() => {
    if (customerList.length > 0 && parsedFilter?.customerId && !filters.customer) {
      const customerExists = customerList.find((customer) => customer.id === parsedFilter.customerId)
      if (customerExists) {
        setFilters((prev) => ({
          ...prev,
          customer: parsedFilter.customerId,
        }))
      }
    }
  }, [customerList, parsedFilter?.customerId, filters.customer])

  // Update filter when search changes
  useEffect(() => {
    if (filters.search !== filter.searchKey) {
      setFilter((prev) => ({
        ...prev,
        warehouseId:"",
        searchKey: filters.search,
        pageIndex: 1,
      }))
      setSearchTrigger((prev) => prev + 1)
    }
  }, [filters.search, filter.searchKey])

  // Update filter when SKU search changes
  useEffect(() => {
    if (filters.skuSearch !== filter.sku) {
      setFilter((prev) => ({
        ...prev,
        sku: filters.skuSearch,
        pageIndex: 1,
      }))
      setSearchTrigger((prev) => prev + 1)
    }
  }, [filters.skuSearch, filter.sku])

  // Update filter when customer changes
  useEffect(() => {
    if (filters.customer !== filter.customerId) {
      setFilter((prev) => ({
        ...prev,
        customerId: filters.customer,
        pageIndex: 1,
      }))
      setSearchTrigger((prev) => prev + 1)
    }
  }, [filters.customer, filter.customerId])

  // Ensure customer changing state is set when we detect customer change effects
  useEffect(() => {
    if (filters.customer !== filter.customerId && filters.customer !== "" && filter.customerId !== "") {
      setIsCustomerChanging(true)
    }
  }, [filters.customer, filter.customerId])

  // Detect customer changes and set loading state
  useEffect(() => {
    if (filters.customer !== previousCustomer && filters.customer !== "") {
      setIsCustomerChanging(true)
      setPreviousCustomer(filters.customer)
    }
  }, [filters.customer, previousCustomer])

  // Handle sorting changes
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    console.log("Sorting changed:", newSorting)
    setSorting(newSorting)
    
    // Convert to API format and update filter
    const { sortColumn, sortDirection } = convertSortingToApiFormat(newSorting)
    setFilter((prev) => ({
      ...prev,
      sortColumn,
      sortDirection,
      pageIndex: 1, // Reset to first page when sorting changes
    }))
    setSearchTrigger((prev) => prev + 1)
  }, [])

  // Create the API payload
  const apiPayload = useMemo(() => filterToPayload(filter), [filter])

  // Determine if we should make API call
  const shouldFetchData = filters.customer && filters.customer !== "" && filters.customer !== "default"

  // Use inventory data hook
  const {
    items: inventoryItems,
    totalCount,
    hasNextPage,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasInitiallyLoaded,
    isError,
    errorMessage,
    fetchNextPage,
    resetPagination,
    refetch,
  } = useInventoryData(apiPayload, shouldFetchData)

  // Enhanced loading state logic - show skeleton when customer changes
  const isTableLoading = useMemo(() => {
    const loading = shouldFetchData && (
      isLoading || 
      isRefreshing || 
      !hasInitiallyLoaded ||
      isCustomerChanging ||
      // Also show loading when customers are being fetched (during customer change)
      isFetchingCustomers
    )
    
    console.log("Table loading state:", {
      shouldFetchData,
      isLoading,
      isRefreshing,
      hasInitiallyLoaded,
      isCustomerChanging,
      isFetchingCustomers,
      finalLoading: loading
    })
    
    return loading
  }, [shouldFetchData, isLoading, isRefreshing, hasInitiallyLoaded, isCustomerChanging, isFetchingCustomers])

  const handleRowClick = useCallback(
    (item: InventoryItem) => {
      console.log("Item clicked:", item)
      push(`/inventory/${encodeURIComponent(item.sku)}?id=${encodeURIComponent(item.id)}`)
    },
    [push],
  )

  const handleFiltersChange = useCallback((newFilters: any) => {
    console.log("Applying filters:", newFilters)
    
    // Extract client-side filters (these will NOT be sent to server)
    const clientSideFilters = {
      warehouse: newFilters.warehouse || "",
      location: newFilters.location || "",
      sku: newFilters.sku || "",
      palletId: newFilters.palletId || "",
    }
    
    // Extract server-side filters (these WILL be sent to server)
    const { warehouse, location, sku, palletId, ...serverFilters } = newFilters
    
    // Update client filters state
    setClientFilters(clientSideFilters)
    
    // Update server filters state (completely separate from client filters)
    setFilter((prev) => ({
      ...prev,
      ...serverFilters,
      pageIndex: 1,
    }))
    
    setSearchTrigger((prev) => prev + 1)
  }, [])

  // Add callback for filter button click to prevent re-renders
  const handleFilterButtonClick = useCallback(() => {
    setFilterSheetOpen(true)
  }, [])

  // Handle customer selection change
  const handleCustomerChange = (value: string) => {
    console.log("Customer selected:", value)

    // Only set loading state if the customer actually changed
    if (value !== previousCustomer) {
      setIsCustomerChanging(true)
      setPreviousCustomer(value)
    }

    // Reset client-side filters when customer changes
    setClientFilters({
      warehouse: "",
      location: "",
      sku: "",
      palletId: "",
    })

    // Update both filter states
    setFilters((prev) => ({
      ...prev,
      customer: value,
      search: value === "" || value === "default" ? "" : prev.search,
      skuSearch: value === "" || value === "default" ? "" : prev.skuSearch,
    }))

    // Update the main filter object
    setFilter((prev) => ({
      ...prev,
      customerId: value,
      searchKey: value === "" || value === "default" ? "" : prev.searchKey,
      sku: value === "" || value === "default" ? "" : prev.sku,
      pageIndex: 1,
    }))

    // Reset sorting when customer changes
    setSorting([])
    setFilter((prev) => ({
      ...prev,
      warehouseId: "",
      sortColumn: "",
      sortDirection: "",
    }))

    // Trigger search to initiate loading state
    setSearchTrigger((prev) => prev + 1)
  }

  // Clear customer changing state when data loads
  useEffect(() => {
    if (isCustomerChanging && hasInitiallyLoaded && !isLoading && !isRefreshing) {
      const timer = setTimeout(() => {
        setIsCustomerChanging(false)
      }, 100) // Small delay to ensure smooth transition
      return () => clearTimeout(timer)
    }
  }, [isCustomerChanging, hasInitiallyLoaded, isLoading, isRefreshing])

  // Save filter to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inventoryListFilter", JSON.stringify(filter))
    }
  }, [filter])

  // Get selected customer name for display
  const getSelectedCustomerName = () => {
    if (!filters.customer || filters.customer === "" || filters.customer === "default") {
      return null
    }

    const selectedCustomer = customerList.find((customer) => customer.id === filters.customer)
    return selectedCustomer ? selectedCustomer.customerName : null
  }

  const showCustomerColumns = filters.customer !== "" && filters.customer !== "default"
  const showTable = filters.customer !== "" && filters.customer !== "default"

  // Actions dropdown component
  const ActionsDropdown = ({ item }: { item: InventoryItem }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => push(`/inventory/${encodeURIComponent(item.sku)}?id=${encodeURIComponent(item.id)}`)}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Edit inventory for", item.sku)}>Edit Inventory</DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Adjust stock for", item.sku)}>Adjust Stock</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // Define columns based on customer selection
  const columns: AdvancedTableColumn<InventoryItem>[] = useMemo(
    () => [
      {
        key: "sku",
        header: "SKU",
        render: (value: string) => (
          <div className="font-medium text-blue-600 truncate">
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 110,
      },

        {
          key: "warehouse" as keyof InventoryItem,
          header: "Warehouse",
          render: (value: string) => (
            <div className="text-gray-900 truncate">
              {value}
            </div>
          ),
          sortable: true,
          minWidth: 100,
        },
        {
        key: "location",
        header: "Location",
        render: (value: string) => (
          <div className="text-gray-700 truncate">
            {value}
          </div>
        ),
        sortable: true,
        minWidth: showCustomerColumns ? 150 : 150,
      },
      {
        key: "palletId",
        header: "Pallet ID",
        render: (value: string) => (
          <div className="text-gray-700 truncate">
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "inbound",
        header: "Inbound",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 80,
      },
      {
        key: "outbound",
        header: "Outbound",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 80,
      },
      {
        key: "adjustment",
        header: "Adjustment",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "onHand",
        header: "On Hand",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value}
          </div>
        ),
        sortable: true,
        minWidth: 80,
      },
      {
        key: "available" as keyof InventoryItem,
        header: "Available",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value || 0}
          </div>
        ),
        sortable: true,
        minWidth: 80,
      },
      {
        key: "onHold" as keyof InventoryItem,
        header: "On Hold",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value || 0}
          </div>
        ),
        sortable: true,
        minWidth: 80,
      },
      {
        key: "reserved" as keyof InventoryItem,
        header: "Reserved",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value || 0}
          </div>
        ),
        sortable: true,
        minWidth: 80,
      },
      {
        key: "description",
        header: "Description",
        render: (value: string) => (
          <div className="text-gray-700 truncate">
            {value || "-"}
          </div>
        ),
        sortable: true,
        minWidth: 550,
      },
      {
        key: "universalProductCode",
        header: "Primary UPC",
        render: (value: string) => (
          <div className="text-gray-700">
            {value || "-"}
          </div>
        ),
        sortable: true,
        minWidth: 150,
      },
      {
        key: "lotNumber",
        header: "Lot #",
        render: (value: string) => (
          <div className="text-gray-700">
            {value || "-"}
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "expirationDate",
        header: "Expiration Date",
        render: (value: string) => (
          <div className="text-gray-700">
            {value ? new Date(value).toLocaleDateString() : "-"}
          </div>
        ),
        sortable: true,
        minWidth: 120,
      },
      {
        key: "serialNumber",
        header: "Serial #",
        render: (value: string) => (
          <div className="text-gray-700">
            {value || "-"}
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "poNumber",
        header: "PO #",
        render: (value: string) => (
          <div className="text-gray-700">
            {value || "-"}
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "receivedDate",
        header: "Received Date",
        render: (value: string) => (
          <div className="text-gray-700">
            {value ? new Date(value).toLocaleDateString() : "-"}
          </div>
        ),
        sortable: true,
        minWidth: 120,
      },
      {
        key: "referenceId",
        header: "Reference ID",
        render: (value: string) => (
          <div className="text-gray-700 truncate">
            {value || "-"}
          </div>
        ),
        sortable: true,
        minWidth: 300,
      },
      {
        key: "weightImperial",
        header: "Weight (lbs)",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value ? value.toFixed(2) : "0.00"}
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "weightMetric",
        header: "Weight (kg)",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value ? value.toFixed(2) : "0.00"}
          </div>
        ),
        sortable: true,
        minWidth: 100,
      },
      {
        key: "volumeCubicInches",
        header: "Volume (cu in)",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value ? value.toFixed(2) : "0.00"}
          </div>
        ),
        sortable: true,
        minWidth: 120,
      },
      {
        key: "volumeCubicFeet",
        header: "Volume (cu ft)",
        render: (value: number) => (
          <div className="text-right font-medium">
            {value ? value.toFixed(2) : "0.00"}
          </div>
        ),
        sortable: true,
        minWidth: 120,
      },
      {
        key: "notes",
        header: "Notes",
        render: (value: string) => (
          <div className="text-gray-700">
            {value || "-"}
          </div>
        ),
        sortable: true,
        minWidth: 150,
      },
      // {
      //   key: "actions",
      //   header: "",
      //   render: (_, item: InventoryItem) => (
      //     <div onClick={(e) => e.stopPropagation()}>
      //       <ActionsDropdown item={item} />
      //     </div>
      //   ),
      //   sortable: false,
      //   minWidth: 50,
      // },
    ],
    [showCustomerColumns, push],
  )

  // Client-side filtering function
  const applyClientFilters = useCallback((items: InventoryItem[]): InventoryItem[] => {
    return items.filter(item => {
      // Warehouse filter
      if (clientFilters.warehouse && 
          !item.warehouse?.toLowerCase().includes(clientFilters.warehouse.toLowerCase())) {
        return false
      }
      
      // Location filter
      if (clientFilters.location && 
          !item.location?.toLowerCase().includes(clientFilters.location.toLowerCase())) {
        return false
      }
      
      // SKU filter
      if (clientFilters.sku && 
          !item.sku?.toLowerCase().includes(clientFilters.sku.toLowerCase())) {
        return false
      }
      
      // Pallet ID filter
      if (clientFilters.palletId && 
          !item.palletId?.toLowerCase().includes(clientFilters.palletId.toLowerCase())) {
        return false
      }
      
      return true
    })
  }, [clientFilters])

  // Apply client-side filtering to inventory items
  const filteredInventoryItems = useMemo(() => {
    return applyClientFilters(inventoryItems)
  }, [inventoryItems, applyClientFilters])

  // Helper function to format numbers - 2 decimal places for decimals, no decimals for integers
  const formatFooterNumber = (value: number) => {
    if (value === 0) return "0"
    if (Number.isInteger(value)) return value.toString()
    return value.toFixed(2)
  }

  // Calculate footer data using filtered inventory items
  const footerData = useMemo(
    () => {
      const weightImperialTotal = filteredInventoryItems.reduce((sum, item) => sum + (item.weightImperial || 0), 0)
      const weightMetricTotal = filteredInventoryItems.reduce((sum, item) => sum + (item.weightMetric || 0), 0)
      const volumeCubicInchesTotal = filteredInventoryItems.reduce((sum, item) => sum + (item.volumeCubicInches || 0), 0)
      const volumeCubicFeetTotal = filteredInventoryItems.reduce((sum, item) => sum + (item.volumeCubicFeet || 0), 0)

      return {
        sku: `Total: ${filteredInventoryItems.length}`,
        warehouse: "",
        location: "",
        palletId: "",
        inbound: filteredInventoryItems.reduce((sum, item) => sum + item.inbound, 0),
        outbound: filteredInventoryItems.reduce((sum, item) => sum + item.outbound, 0),
        adjustment: filteredInventoryItems.reduce((sum, item) => sum + item.adjustment, 0),
        onHand: filteredInventoryItems.reduce((sum, item) => sum + item.onHand, 0),
        available: filteredInventoryItems.reduce((sum, item) => sum + (item.available || 0), 0),
        onHold: filteredInventoryItems.reduce((sum, item) => sum + (item.onHold || 0), 0),
        reserved: filteredInventoryItems.reduce((sum, item) => sum + (item.reserved || 0), 0),
        description: "",
        universalProductCode: "",
        lotNumber: "",
        expirationDate: "",
        serialNumber: "",
        poNumber: "",
        receivedDate: "",
        referenceId: "",
        weightImperial: formatFooterNumber(weightImperialTotal),
        weightMetric: formatFooterNumber(weightMetricTotal),
        volumeCubicInches: formatFooterNumber(volumeCubicInchesTotal),
        volumeCubicFeet: formatFooterNumber(volumeCubicFeetTotal),
        notes: "",
        actions: "",
      }
    },
    [filteredInventoryItems, totalCount],
  )

  console.log("Filtered Inventory Items: {filteredInventoryItems}", filteredInventoryItems)
  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader
          title="Real Time Inventory"
          breadcrumbItems={breadcrumbItems}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          actions={
            <div className="flex items-center gap-3">
              {/* General Search */}
              {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search inventory..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-48"
                  disabled={!showTable}
                />
              </div> */}
              
              {/* SKU Search with Camera */}
              <SearchWithCamera
                placeholder="Search SKU..."
                onSearch={(value) => setFilters((prev) => ({ ...prev, skuSearch: value }))}
                className="w-40"
              />
            </div>
          }
        />
      </div>

      {/* Fixed Filters Section */}
      <div className="flex-shrink-0 px-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Select
              value={filters.customer || ""}
              onValueChange={handleCustomerChange}
              disabled={isLoadingCustomers || isFetchingCustomers}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Customer">{getSelectedCustomerName()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {isLoadingCustomers || isFetchingCustomers ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">Loading customers...</span>
                  </div>
                ) : customerError ? (
                  <div className="flex items-center justify-center py-6">
                    <span className="text-sm text-red-500">Error loading customers</span>
                  </div>
                ) : (
                  <>
                    <SelectItem value="default">Select Customer</SelectItem>
                    {customerList.length > 0 ? (
                      customerList.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.customerName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-4">
                        <span className="text-sm text-gray-500">No customers available</span>
                      </div>
                    )}
                  </>
                )}
              </SelectContent>
            </Select>

            {/* Cache status indicator and refresh button */}
            {/* {isUsingCache && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshCache}
                  className="h-8 w-8 p-0"
                  title="Refresh customer list"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )} */}
          </div>

          {/* <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded bg-transparent"
            onClick={() => setColumnSheetOpen(true)}
            disabled={!showTable}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.5928 1.56665V14.4329H14.2061V1.56665H14.5928ZM10.3262 1.56665V14.4329H9.93945V1.56665H10.3262ZM6.05957 1.56665V14.4329H5.67285V1.56665H6.05957ZM1.79297 1.56665V14.4329H1.40625V1.56665H1.79297Z"
                fill="#0C0A09"
                stroke="#0C0A09"
              />
            </svg>
          </Button> */}

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded bg-transparent"
            onClick={handleFilterButtonClick}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.728923 1.71946C0.838161 1.48401 1.07412 1.33337 1.33367 1.33337H14.667C14.9266 1.33337 15.1625 1.48401 15.2717 1.71946C15.381 1.9549 15.3436 2.23234 15.176 2.43052L10.0003 8.55081V14C10.0003 14.2311 9.8807 14.4457 9.68415 14.5671C9.48761 14.6886 9.24218 14.6997 9.03553 14.5963L6.36886 13.263C6.143 13.1501 6.00033 12.9192 6.00033 12.6667V8.55081L0.824621 2.43052C0.657023 2.23234 0.619684 1.9549 0.728923 1.71946ZM2.77054 2.66671L7.17605 7.87622C7.27782 7.99657 7.33367 8.14909 7.33367 8.30671V12.2547L8.667 12.9214V8.30671C8.667 8.14909 8.72284 7.99657 8.82462 7.87622L13.2301 2.66671H2.77054Z"
                fill="#0C0A09"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {errorMessage && showTable && (
        <div className="flex-shrink-0 px-4 mb-2">
          <GlobalErrorFallback 
            variant="inline"
            error={errorMessage}
            onRetry={() => {
              resetPagination()
              refetch()
            }}
            showRetry={true}
          />
        </div>
      )}

      {/* Flexible Table Section - Takes remaining space with proper height constraints */}
      <div className="flex-1 px-4 pb-2 min-h-0 overflow-hidden">
        {showTable ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <AdvancedTable.Root
              data={filteredInventoryItems}
              columns={columns}
              onRowClick={handleRowClick}
              // enableBulkSelection={true}
              stickyColumns={{
                left: ["sku"],
                // right: ["actions"],
              }}
              isLoading={isTableLoading}
              emptyMessage={
                isTableLoading 
                  ? "Loading inventory..." 
                  : errorMessage 
                    ? errorMessage 
                    : "No inventory items found matching your criteria"
              }
              // Controlled sorting props
              sorting={sorting}
              onSortingChange={handleSortingChange}
              manualSorting={true}
              className="h-full"
            >
              <div className="flex flex-col h-full">
                <AdvancedTable.Container
                  hasNextPage={hasNextPage}
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isLoadingMore}
                  className="flex-1 min-h-0"
                >
                  <AdvancedTable.Table>
                    <AdvancedTable.Header />
                    <AdvancedTable.Body />
                    <AdvancedTable.Footer footerData={footerData} />
                  </AdvancedTable.Table>
                </AdvancedTable.Container>
              </div>
            </AdvancedTable.Root>
          </div>
        ) : (
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <InventoryEmptyState />
          </div>
        )}
      </div>

      {/* Sheets */}
      <InventoryColumnCustomizationSheet open={columnSheetOpen} onOpenChange={setColumnSheetOpen} />

      <InventoryFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        onFiltersChange={handleFiltersChange}
        columns={columns}
        showCustomerColumns={showCustomerColumns}
        currentFilters={{...filter, ...clientFilters}}
        inventoryItems={filteredInventoryItems}
      />
    </div>
  )
}