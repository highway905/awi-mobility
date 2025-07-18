"use client"

import { useState, useEffect, memo, useCallback, useMemo } from "react"
import { X, Package, MapPin, Hash, BarChart3, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useInventoryLocationCache, useWarehouseCache, useCustomerCache } from "@/hooks"
import type { AdvancedTableColumn } from "@/features/shared/components/advanced-table"
import type { InventoryItem } from "../hooks/use-inventory-data"

// Define InventoryLocation interface locally to avoid import issues
interface InventoryLocation {
  id: string
  locationName: string
  warehouseName?: string
}

interface FilterState {
  customer: string
  sku: string
  warehouse: string
  location: string
  palletId: string
  inboundMin: string
  inboundMax: string
  outboundMin: string
  outboundMax: string
  adjustmentMin: string
  adjustmentMax: string
  onHandMin: string
  onHandMax: string
  availableMin: string
  availableMax: string
  onHoldMin: string
  onHoldMax: string
}

interface InventoryFilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFiltersChange: (filters: any) => void
  columns: AdvancedTableColumn<InventoryItem>[]
  showCustomerColumns: boolean
  currentFilters?: Partial<FilterState>
  inventoryItems?: InventoryItem[]
}

export const InventoryFilterSheet = memo(function InventoryFilterSheet({
  open,
  onOpenChange,
  onFiltersChange,
  columns,
  showCustomerColumns,
  currentFilters = {},
  inventoryItems = [],
}: InventoryFilterSheetProps) {
  const [filters, setFilters] = useState<FilterState>({
    customer: currentFilters.customer || "",
    sku: currentFilters.sku || "",
    warehouse: currentFilters.warehouse || "",
    location: currentFilters.location || "",
    palletId: currentFilters.palletId || "",
    inboundMin: currentFilters.inboundMin || "",
    inboundMax: currentFilters.inboundMax || "",
    outboundMin: currentFilters.outboundMin || "",
    outboundMax: currentFilters.outboundMax || "",
    adjustmentMin: currentFilters.adjustmentMin || "",
    adjustmentMax: currentFilters.adjustmentMax || "",
    onHandMin: currentFilters.onHandMin || "",
    onHandMax: currentFilters.onHandMax || "",
    availableMin: currentFilters.availableMin || "",
    availableMax: currentFilters.availableMax || "",
    onHoldMin: currentFilters.onHoldMin || "",
    onHoldMax: currentFilters.onHoldMax || "",
  })

  // Sync with currentFilters when they change - use callback to prevent unnecessary updates
  useEffect(() => {
    if (open) {
      setFilters({
        customer: currentFilters.customer || "",
        sku: currentFilters.sku || "",
        warehouse: currentFilters.warehouse || "",
        location: currentFilters.location || "",
        palletId: currentFilters.palletId || "",
        inboundMin: currentFilters.inboundMin || "",
        inboundMax: currentFilters.inboundMax || "",
        outboundMin: currentFilters.outboundMin || "",
        outboundMax: currentFilters.outboundMax || "",
        adjustmentMin: currentFilters.adjustmentMin || "",
        adjustmentMax: currentFilters.adjustmentMax || "",
        onHandMin: currentFilters.onHandMin || "",
        onHandMax: currentFilters.onHandMax || "",
        availableMin: currentFilters.availableMin || "",
        availableMax: currentFilters.availableMax || "",
        onHoldMin: currentFilters.onHoldMin || "",
        onHoldMax: currentFilters.onHoldMax || "",
      })
    }
  }, [open, currentFilters])

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleApplyFilters = useCallback(() => {
    // Create separate objects for client-side and server-side filters
    const clientSideFilters = {
      warehouse: filters.warehouse,
      location: filters.location,
      sku: filters.sku,
      palletId: filters.palletId,
    }
    
    const serverSideFilters: any = {}
    
    // Server-side filters (sent to API)
    if (filters.customer) serverSideFilters.customerId = filters.customer
    
    // Add numeric range filters (server-side)
    if (filters.inboundMin) serverSideFilters.inboundMin = parseInt(filters.inboundMin)
    if (filters.inboundMax) serverSideFilters.inboundMax = parseInt(filters.inboundMax)
    if (filters.outboundMin) serverSideFilters.outboundMin = parseInt(filters.outboundMin)
    if (filters.outboundMax) serverSideFilters.outboundMax = parseInt(filters.outboundMax)
    if (filters.adjustmentMin) serverSideFilters.adjustmentMin = parseInt(filters.adjustmentMin)
    if (filters.adjustmentMax) serverSideFilters.adjustmentMax = parseInt(filters.adjustmentMax)
    if (filters.onHandMin) serverSideFilters.onHandMin = parseInt(filters.onHandMin)
    if (filters.onHandMax) serverSideFilters.onHandMax = parseInt(filters.onHandMax)
    
    if (showCustomerColumns) {
      if (filters.availableMin) serverSideFilters.availableMin = parseInt(filters.availableMin)
      if (filters.availableMax) serverSideFilters.availableMax = parseInt(filters.availableMax)
      if (filters.onHoldMin) serverSideFilters.onHoldMin = parseInt(filters.onHoldMin)
      if (filters.onHoldMax) serverSideFilters.onHoldMax = parseInt(filters.onHoldMax)
    }
    
    // Combine both client-side and server-side filters for the callback
    // The main component will separate them again
    const combinedFilters = {
      ...serverSideFilters,
      ...clientSideFilters
    }
    
    onFiltersChange(combinedFilters)
    onOpenChange(false)
  }, [filters, showCustomerColumns, onFiltersChange, onOpenChange])

  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      customer: "",
      sku: "",
      warehouse: "",
      location: "",
      palletId: "",
      inboundMin: "",
      inboundMax: "",
      outboundMin: "",
      outboundMax: "",
      adjustmentMin: "",
      adjustmentMax: "",
      onHandMin: "",
      onHandMax: "",
      availableMin: "",
      availableMax: "",
      onHoldMin: "",
      onHoldMax: "",
    }
    setFilters(resetFilters)
    
    // Send combined reset values (both client-side and server-side)
    onFiltersChange({
      // Server-side resets
      customerId: "",
      inboundMin: undefined,
      inboundMax: undefined,
      outboundMin: undefined,
      outboundMax: undefined,
      adjustmentMin: undefined,
      adjustmentMax: undefined,
      onHandMin: undefined,
      onHandMax: undefined,
      availableMin: undefined,
      availableMax: undefined,
      onHoldMin: undefined,
      onHoldMax: undefined,
      // Client-side resets
      warehouse: "",
      location: "",
      sku: "",
      palletId: "",
    })
    
    // Close the sheet after resetting
    onOpenChange(false)
  }, [onFiltersChange, onOpenChange])

  // Check which columns are available - memoized to prevent re-computation
  // const { hasWarehouseColumn, hasLocationColumn, hasPalletIdColumn } = useMemo(() => ({
  //   hasWarehouseColumn: columns.some(col => col.key === "warehouse"),
  //   hasLocationColumn: columns.some(col => col.key === "location"),
  //   hasPalletIdColumn: columns.some(col => col.key === "palletId")
  // }), [columns])

  // Only fetch data when sheet is open to improve performance
  const { 
    customers: apiCustomers = [], 
    isLoading: isLoadingCustomers = false,
    error: customersError 
  } = useCustomerCache(open) // Only fetch when sheet is open

  // Use warehouse cache hook for warehouses - only when sheet is open
  const { 
    warehouses: apiWarehouses = [], 
    isLoading: isLoadingWarehouses = false,
    error: warehousesError 
  } = useWarehouseCache(open) // Only fetch when sheet is open

  // Use inventory location cache hook for locations - only when sheet is open and warehouse selected
  // const shouldFetchLocations = open && filters.warehouse && filters.warehouse !== ""
  
  const shouldFetchLocations = false 

  const locationHookResult = useInventoryLocationCache({
    searchKey: "",
    sortColumn: "locationName",
    sortDirection: "asc",
    pageIndex: 0,
    pageSize: 1000,
    warehouseId: shouldFetchLocations ? filters.warehouse : "", // Pass the selected warehouse ID
    locationTypeId: []
  }, shouldFetchLocations) // Only fetch when sheet is open and warehouse is selected
  
  // Handle potential errors gracefully when accessing hook data
  let apiLocations: InventoryLocation[] = []
  let isLoadingLocations = false
  let locationsError = null
  
  if (shouldFetchLocations) {
    try {
      apiLocations = locationHookResult?.locations || []
      isLoadingLocations = locationHookResult?.isLoading || false
      locationsError = locationHookResult?.error || null
    } catch (error) {
      locationsError = error
    }
  }

  // Since we're filtering by warehouse ID in the API call, we can use locations directly
  const getFilteredLocations = () => {
    // API already filters by warehouse ID, so return all locations from API
    return apiLocations
  }

  // Get unique locations from current inventory items for the dropdown
  const uniqueLocations = useMemo(() => {
    if (!inventoryItems || inventoryItems.length === 0) return []
    
    const locationSet = new Set<string>()
    inventoryItems.forEach(item => {
      if (item.location && item.location.trim() !== '') {
        locationSet.add(item.location.trim())
      }
    })
    
    return Array.from(locationSet).sort()
  }, [inventoryItems])

  // Get unique warehouses from current inventory items for the dropdown
  const uniqueWarehouses = useMemo(() => {
    if (!inventoryItems || inventoryItems.length === 0) return []
    
    const warehouseSet = new Set<string>()
    inventoryItems.forEach(item => {
      if (item.warehouse && item.warehouse.trim() !== '') {
        warehouseSet.add(item.warehouse.trim())
      }
    })
    
    return Array.from(warehouseSet).sort()
  }, [inventoryItems])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96 flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Filters</SheetTitle>
              {/* <SheetDescription>Filter inventory by specific criteria</SheetDescription> */}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 border-t bg-white overflow-y-auto py-6">
          <div className="space-y-6">
            {/* SKU Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                SKU
              </Label>
              <Input
                placeholder="Enter SKU to filter"
                value={filters.sku}
                onChange={(e) => handleFilterChange("sku", e.target.value)}
              />
            </div>

            {/* Customer Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </Label>
              <Select
                value={filters.customer || "all"}
                onValueChange={(value) => {
                  const newCustomer = value === "all" ? "" : value
                  handleFilterChange("customer", newCustomer)
                  // Clear dependent filters when customer changes
                  if (newCustomer !== filters.customer) {
                    handleFilterChange("warehouse", "")
                    handleFilterChange("location", "")
                  }
                }}
                disabled={isLoadingCustomers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCustomers ? "Loading customers..." : "Select customer"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {apiCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customersError && (
                <p className="text-xs text-red-600">Failed to load customers</p>
              )}
            </div>

            {/* Warehouse Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Warehouse
              </Label>
              <Select
                value={filters.warehouse || "all"}
                onValueChange={(value) => {
                  const newWarehouse = value === "all" ? "" : value
                  handleFilterChange("warehouse", newWarehouse)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {uniqueWarehouses.map((warehouse) => (
                    <SelectItem key={warehouse} value={warehouse}>
                      {warehouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            

            {/* Location Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Select
                value={filters.location || "all"}
                onValueChange={(value) => {
                  const newLocation = value === "all" ? "" : value
                  handleFilterChange("location", newLocation)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pallet ID Filter */}
            
              <div className="space-y-2">
                <Label className="text-sm font-medium">Pallet ID</Label>
                <Input
                  placeholder="Enter Pallet ID"
                  value={filters.palletId}
                  onChange={(e) => handleFilterChange("palletId", e.target.value)}
                />
              </div>
            

          
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t bg-white">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
})
