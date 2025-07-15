"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { TaskFilters } from "../types"

interface TasksFilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
}

export function TasksFilterSheet({ open, onOpenChange, filters, onFiltersChange }: TasksFilterSheetProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleReset = () => {
    const resetFilters: TaskFilters = {
      search: "",
      assignmentFilter: "all",
      includeClosed: false,
      status: "all",
      priority: "all",
      orderType: "all",
    }
    setLocalFilters(resetFilters)
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onOpenChange(false)
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "In Progress", label: "In Progress" },
    { value: "Waiting", label: "Waiting" },
    { value: "Paused", label: "Paused" },
    { value: "Yet to Start", label: "Yet to Start" },
    { value: "Completed", label: "Completed" },
    { value: "On Hold", label: "On Hold" },
  ]

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ]

  const orderTypeOptions = [
    { value: "all", label: "All Order Types" },
    { value: "B2B", label: "B2B" },
    { value: "B2C", label: "B2C" },
    { value: "B2B Returns", label: "B2B Returns" },
    { value: "B2C Returns", label: "B2C Returns" },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filter Tasks</SheetTitle>
          <p className="text-sm text-gray-600">Filter tasks by status, priority, and order type</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium mb-3 block">Status</label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-sm font-medium mb-3 block">Priority</label>
            <Select
              value={localFilters.priority}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Type Filter */}
          <div>
            <label className="text-sm font-medium mb-3 block">Order Type</label>
            <Select
              value={localFilters.orderType}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, orderType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                {orderTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t bg-white p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Apply Filters</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
