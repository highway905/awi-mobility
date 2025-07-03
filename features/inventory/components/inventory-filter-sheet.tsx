"use client"

import { useState } from "react"
import { X, Package, MapPin, Hash, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import type { AdvancedTableColumn } from "@/features/shared/components/advanced-table"
import type { InventoryItem } from "../hooks/use-inventory-data"

interface FilterState {
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
}

export function InventoryFilterSheet({
  open,
  onOpenChange,
  onFiltersChange,
  columns,
  showCustomerColumns,
}: InventoryFilterSheetProps) {
  const [filters, setFilters] = useState<FilterState>({
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
  })

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    // Convert filters to API format, only include non-empty values
    const apiFilters: any = {}
    
    if (filters.sku) apiFilters.sku = filters.sku
    if (filters.warehouse) apiFilters.warehouseId = filters.warehouse
    if (filters.location) apiFilters.locationId = filters.location
    if (filters.palletId) apiFilters.palletId = filters.palletId
    
    // Add numeric range filters
    if (filters.inboundMin) apiFilters.inboundMin = parseInt(filters.inboundMin)
    if (filters.inboundMax) apiFilters.inboundMax = parseInt(filters.inboundMax)
    if (filters.outboundMin) apiFilters.outboundMin = parseInt(filters.outboundMin)
    if (filters.outboundMax) apiFilters.outboundMax = parseInt(filters.outboundMax)
    if (filters.adjustmentMin) apiFilters.adjustmentMin = parseInt(filters.adjustmentMin)
    if (filters.adjustmentMax) apiFilters.adjustmentMax = parseInt(filters.adjustmentMax)
    if (filters.onHandMin) apiFilters.onHandMin = parseInt(filters.onHandMin)
    if (filters.onHandMax) apiFilters.onHandMax = parseInt(filters.onHandMax)
    
    if (showCustomerColumns) {
      if (filters.availableMin) apiFilters.availableMin = parseInt(filters.availableMin)
      if (filters.availableMax) apiFilters.availableMax = parseInt(filters.availableMax)
      if (filters.onHoldMin) apiFilters.onHoldMin = parseInt(filters.onHoldMin)
      if (filters.onHoldMax) apiFilters.onHoldMax = parseInt(filters.onHoldMax)
    }
    
    onFiltersChange(apiFilters)
    onOpenChange(false)
  }

  const handleResetFilters = () => {
    const resetFilters = {
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
    onFiltersChange({}) // Send empty object to clear all filters
  }

  // Check which columns are available
  const hasWarehouseColumn = columns.some(col => col.key === "warehouse")
  const hasLocationColumn = columns.some(col => col.key === "location")
  const hasPalletIdColumn = columns.some(col => col.key === "palletId")

  // Mock data for dropdowns - in real app, these would come from API
  const warehouses = [
    { id: "main", name: "Main Warehouse" },
    { id: "secondary", name: "Secondary Warehouse" },
    { id: "distribution", name: "Distribution Center" },
  ]

  const locations = [
    { id: "a-01-01", name: "A-01-01" },
    { id: "a-01-02", name: "A-01-02" },
    { id: "b-02-01", name: "B-02-01" },
    { id: "b-02-02", name: "B-02-02" },
    { id: "c-03-01", name: "C-03-01" },
    { id: "c-03-02", name: "C-03-02" },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96 flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>Filter inventory by specific criteria</SheetDescription>
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

        <div className="flex-1 overflow-y-auto py-6">
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

            {/* Warehouse Filter - only show if warehouse column exists */}
            {hasWarehouseColumn && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Warehouse
                </Label>
                <Select
                  value={filters.warehouse || "all"}
                  onValueChange={(value) => handleFilterChange("warehouse", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Location Filter */}
            {hasLocationColumn && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Select
                  value={filters.location || "all"}
                  onValueChange={(value) => handleFilterChange("location", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pallet ID Filter */}
            {hasPalletIdColumn && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Pallet ID</Label>
                <Input
                  placeholder="Enter Pallet ID"
                  value={filters.palletId}
                  onChange={(e) => handleFilterChange("palletId", e.target.value)}
                />
              </div>
            )}

            {/* Numeric Range Filters */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Quantity Ranges
              </Label>

              {/* Inbound Range */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Inbound Quantity</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.inboundMin}
                    onChange={(e) => handleFilterChange("inboundMin", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.inboundMax}
                    onChange={(e) => handleFilterChange("inboundMax", e.target.value)}
                  />
                </div>
              </div>

              {/* Outbound Range */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Outbound Quantity</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.outboundMin}
                    onChange={(e) => handleFilterChange("outboundMin", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.outboundMax}
                    onChange={(e) => handleFilterChange("outboundMax", e.target.value)}
                  />
                </div>
              </div>

              {/* Adjustment Range */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Adjustment Quantity</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.adjustmentMin}
                    onChange={(e) => handleFilterChange("adjustmentMin", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.adjustmentMax}
                    onChange={(e) => handleFilterChange("adjustmentMax", e.target.value)}
                  />
                </div>
              </div>

              {/* On Hand Range */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">On Hand Quantity</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.onHandMin}
                    onChange={(e) => handleFilterChange("onHandMin", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.onHandMax}
                    onChange={(e) => handleFilterChange("onHandMax", e.target.value)}
                  />
                </div>
              </div>

              {/* Customer-specific columns */}
              {showCustomerColumns && (
                <>
                  {/* Available Range */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Available Quantity</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.availableMin}
                        onChange={(e) => handleFilterChange("availableMin", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.availableMax}
                        onChange={(e) => handleFilterChange("availableMax", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* On Hold Range */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">On Hold Quantity</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.onHoldMin}
                        onChange={(e) => handleFilterChange("onHoldMin", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.onHoldMax}
                        onChange={(e) => handleFilterChange("onHoldMax", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
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
}