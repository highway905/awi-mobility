"use client"

import { useState } from "react"
import type { DashboardFilters } from "../types"

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: "today",
    status: "all",
    department: "abisec",
  })

  const updateFilter = (key: keyof DashboardFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      dateRange: "today",
      status: "all",
      department: "abisec",
    })
  }

  return {
    filters,
    updateFilter,
    resetFilters,
  }
}
