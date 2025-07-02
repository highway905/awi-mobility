"use client"

import { useState, useCallback, useEffect } from "react"

export interface FilterState {
  customer: string
  warehouse: string
  location: string
  stockLevel: string
  palletId: string
  search: string
}

export interface InventoryFilters {
  customer: string
  search: string
}

const defaultFilters: FilterState = {
  customer: "",
  warehouse: "",
  location: "",
  stockLevel: "",
  palletId: "",
  search: "",
}

export function useInventoryFilters(storageKey?: string) {
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window !== "undefined" && storageKey) {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const parsedFilters = JSON.parse(stored)
          // Ensure we have all required fields
          return { ...defaultFilters, ...parsedFilters }
        } catch {
          return defaultFilters
        }
      }
    }
    return defaultFilters
  })

  // Track if this is the initial load to trigger API calls
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Mark as initialized after first render
    setIsInitialized(true)
  }, [])

  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const clearSearch = useCallback(() => {
    setFilters((prev) => ({ ...prev, search: "" }))
  }, [])

  // Save to localStorage when filters change (but not on initial load)
  useEffect(() => {
    if (typeof window !== "undefined" && storageKey && isInitialized) {
      localStorage.setItem(storageKey, JSON.stringify(filters))
    }
  }, [filters, storageKey, isInitialized])

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearSearch,
    setFilters,
    isInitialized,
  }
}
