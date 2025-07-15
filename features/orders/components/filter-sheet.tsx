"use client"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import type React from "react"

import { X, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface FilterData {
  referenceId?: string
  transactionId?: string
  customerIds?: string[]
  carrierIds?: string[]
  orderTypes?: string[]
  statuses?: string[]
  dateType?: "AppointmentDate"
  fromDate?: string
  toDate?: string
}

interface Customer {
  id: string
  customerName: string
}

interface FilterSheetProps {
  isOpen: boolean
  onClose: () => void
  onFiltersApply: (filters: FilterData) => void
  initialFilters?: FilterData
  customers?: Customer[]
  isLoadingCustomers?: boolean
}

export function FilterSheet({
  isOpen,
  onClose,
  onFiltersApply,
  initialFilters = {},
  customers = [],
  isLoadingCustomers = false,
}: FilterSheetProps) {
  const [filter, setFilter] = useState<FilterData>({})
  const hasInitialized = useRef(false)

  // Initialize filters only once when sheet opens
  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      setFilter(initialFilters || {})
      hasInitialized.current = true
    }

    if (!isOpen) {
      hasInitialized.current = false
    }
  }, [isOpen])

  // Field change handler
  const change = useCallback((field: keyof FilterData, value: any) => {
    setFilter((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Apply filters - simplified
  const apply = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      onFiltersApply(filter)
    },
    [filter, onFiltersApply],
  )

  // Reset filters
  const reset = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      const emptyFilter = {}
      setFilter(emptyFilter)
      onFiltersApply(emptyFilter)
    },
    [onFiltersApply],
  )

  // Close handler
  const handleClose = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      onClose()
    },
    [onClose],
  )

  // Check if filters are empty
  const isEmpty = useMemo(
    () => Object.values(filter).every((v) => v == null || v === "" || (Array.isArray(v) && v.length === 0)),
    [filter],
  )

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[500px] flex flex-col p-0">
        <SheetHeader className="flex flex-row  items-between justify-between p-6 pb-4 border-b">
          <SheetTitle>Order Filters</SheetTitle>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-6">
          {/* Reference ID */}
          <div className="space-y-2">
            <Label>Reference ID</Label>
            <Input
              placeholder="Enter reference ID"
              value={filter.referenceId || ""}
              onChange={(e) => change("referenceId", e.target.value)}
            />
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <Label>Transaction ID</Label>
            <Input
              placeholder="Enter transaction ID"
              value={filter.transactionId || ""}
              onChange={(e) => change("transactionId", e.target.value)}
            />
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select
              value={filter.customerIds?.[0] || "all"}
              onValueChange={(v) => change("customerIds", v === "all" ? [] : [v])}
              disabled={isLoadingCustomers}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.customerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channel */}
          <div className="space-y-2">
            <Label>Channel</Label>
            <Select
              value={filter.carrierIds?.[0] || "all"}
              onValueChange={(value) => change("carrierIds", value === "all" ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Type */}
          <div className="space-y-2">
            <Label>Order Type</Label>
            <Select
              value={filter.orderTypes?.[0] || "all"}
              onValueChange={(value) => change("orderTypes", value === "all" ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="b2b">B2B</SelectItem>
                <SelectItem value="b2c">B2C</SelectItem>
                <SelectItem value="b2b-returns">B2B Returns</SelectItem>
                <SelectItem value="b2c-returns">B2C Returns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filter.statuses?.[0] || "all"}
              onValueChange={(value) => change("statuses", value === "all" ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="initialized">Initialized</SelectItem>
                <SelectItem value="ready-to-process">Ready to Process</SelectItem>
                <SelectItem value="unloading">Unloading</SelectItem>
                <SelectItem value="receiving">Receiving</SelectItem>
                <SelectItem value="putaway">Putaway</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointment Date */}
          <div className="space-y-2">
            <Label>Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !(filter.dateType === "AppointmentDate" && filter.fromDate) && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filter.dateType === "AppointmentDate" && filter.fromDate
                    ? format(new Date(filter.fromDate), "PPP")
                    : "Select appointment date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filter.dateType === "AppointmentDate" && filter.fromDate ? new Date(filter.fromDate) : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      change("dateType", "AppointmentDate")
                      change("fromDate", date.toISOString())
                      change("toDate", undefined)
                    } else {
                      change("dateType", undefined)
                      change("fromDate", undefined)
                      change("toDate", undefined)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t p-6 bg-white">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              disabled={isEmpty}
              className="flex-1 bg-transparent"
            >
              Clear All
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="button" onClick={apply} className="flex-1">
              Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
