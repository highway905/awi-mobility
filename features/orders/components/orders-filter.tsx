"use client"

import { useState, useCallback, useEffect } from "react"
import { Search, Filter, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DateRangePicker from "@/components/ui/date-range-picker"
import { cn } from "@/lib/utils"
import { debounce } from "../utils/order.utils"
import type { DateRange, OrderTab, OrderFilter } from "../types/order.types"

interface OrdersFilterProps {
  activeTab: OrderTab
  onTabChange: (tab: OrderTab) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  filter: OrderFilter
  onFilterChange: (filter: Partial<OrderFilter>) => void
  onAdvancedFiltersClick?: () => void
  onColumnCustomizationClick?: () => void
}

export function OrdersFilter({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  filter,
  onFilterChange,
  onAdvancedFiltersClick,
  onColumnCustomizationClick,
}: OrdersFilterProps) {
  // Local state for immediate UI updates
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  // Update local state when external searchQuery changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Debounced search handler to prevent too many API calls
  const debouncedSearchChange = useCallback(
    debounce((query: string) => {
      onSearchChange(query)
    }, 500),
    [onSearchChange]
  )

  // Handle search input change with immediate UI update and debounced API call
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setLocalSearchQuery(newQuery)
    debouncedSearchChange(newQuery)
  }, [debouncedSearchChange])

  // Handle date range change with immediate API call
  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    const dateRange = range || { from: undefined, to: undefined }
    onDateRangeChange(dateRange)
    
    // Update filter and trigger API call if both dates are selected
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from)
      fromDate.setHours(0, 0, 0, 0)
      
      const toDate = new Date(dateRange.to)
      toDate.setHours(23, 59, 59, 999)
      
      onFilterChange({
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        pageIndex: 1,
      })
    }
  }, [onDateRangeChange, onFilterChange])

  // Handle tab change with immediate filter update
  const handleTabChange = useCallback((tab: string) => {
    const newTab = tab as OrderTab
    onTabChange(newTab)
    
    onFilterChange({
      pageIndex: 1,
    })
  }, [onTabChange, onFilterChange])

  // Clear date range
  const clearDateRange = useCallback(() => {
    onDateRangeChange({ from: undefined, to: undefined })
    onFilterChange({
      fromDate: undefined,
      toDate: undefined,
      pageIndex: 1,
    })
  }, [onDateRangeChange, onFilterChange])

  return (
    <>
      <div className="h-9 flex items-center justify-between gap-4 w-full">
        {/* Left side - Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="h-9 bg-[#F5F5F4] border border-[#D6D3D1]">
            <TabsTrigger value="all" className="h-7">
              All
            </TabsTrigger>
            <TabsTrigger value="inbound" className="h-7">
              Inbound
            </TabsTrigger>
            <TabsTrigger value="outbound" className="h-7">
              Outbound
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right side - Search, Date, Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search Box */}
          <div className="relative w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="w-[250px] h-9 pl-9 pr-4"
            />
          </div>

          {/* Date Picker with improved styling */}
           <DateRangePicker
              date={dateRange}
              onDateChange={handleDateRangeChange}
              placeholder="Pick a date range"
              width="w-[300px]"
            />

          {/* Filter Icon */}
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 flex-shrink-0"
            onClick={() => onAdvancedFiltersClick?.()}
          >
            <Filter className="h-4 w-4" />
          </Button>

          {/* Column Customization Icon */}
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 flex-shrink-0"
            onClick={() => onColumnCustomizationClick?.()}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}