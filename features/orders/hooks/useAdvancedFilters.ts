"use client"

import { useState, useCallback, useEffect } from "react"
import { useLocalStorage } from "@/features/orders/hooks/useOrderHooks"

export interface SavedFilterPreset {
  id: string
  name: string
  description?: string
  filters: OrderAdvancedFilter
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderAdvancedFilter {
  // Basic filters
  searchKey?: string
  orderTypes?: string[]
  statuses?: string[]
  customerIds?: string[]
  
  // Date filters
  dateType?: 'RequestCreated' | 'AppointmentDate' | 'CompletionDate'
  fromDate?: string
  toDate?: string
  
  // Location & logistics
  warehouseIds?: string[]
  locationIds?: string[]
  transportationMethodIds?: string[]
  carrierIds?: string[]
  
  // Order details
  referenceId?: string
  transactionId?: string
  trackingNumber?: string
  sku?: string
  
  // Assignment & tasks
  taskIds?: string[]
  assignedToUserIds?: string[]
  priority?: 'High' | 'Medium' | 'Low'
  
  // Address filters
  recipientName?: string
  recipientAddress?: string
  recipientState?: string
  shipperName?: string
  shipperAddress?: string
  shipperState?: string
  
  // Advanced logistics
  trailerNumber?: string
  loadTypeIds?: string[]
  cargoTypeIds?: string[]
  trailerTypeIds?: string[]
  
  // Metadata
  createdByUserIds?: string[]
}

export interface FilterValidationError {
  field: string
  message: string
}

export function useAdvancedFilters() {
  const [currentFilter, setCurrentFilter] = useState<OrderAdvancedFilter>({})
  const [savedPresets, setSavedPresets] = useLocalStorage<SavedFilterPreset[]>('order-filter-presets', [])
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<FilterValidationError[]>([])

  // Initialize with default preset if available
  useEffect(() => {
    const defaultPreset = savedPresets.find(preset => preset.isDefault)
    if (defaultPreset && Object.keys(currentFilter).length === 0) {
      setCurrentFilter(defaultPreset.filters)
    }
  }, [savedPresets, currentFilter])

  // Validate filter input
  const validateFilter = useCallback((filter: OrderAdvancedFilter): FilterValidationError[] => {
    const errors: FilterValidationError[] = []

    // Date validation
    if (filter.fromDate && filter.toDate) {
      try {
        const fromDate = new Date(filter.fromDate)
        const toDate = new Date(filter.toDate)
        
        // Check if dates are valid
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          errors.push({
            field: 'dateRange',
            message: 'Invalid date format'
          })
          return errors
        }
        
        if (fromDate > toDate) {
          errors.push({
            field: 'dateRange',
            message: 'From date must be before to date'
          })
        }

        // Check if date range is too large (more than 1 year)
        const diffTime = Math.abs(toDate.getTime() - fromDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays > 365) {
          errors.push({
            field: 'dateRange',
            message: 'Date range cannot exceed 365 days'
          })
        }
      } catch (error) {
        errors.push({
          field: 'dateRange',
          message: 'Invalid date format'
        })
      }
    }

    // Array length validations
    if (filter.orderTypes && filter.orderTypes.length > 10) {
      errors.push({
        field: 'orderTypes',
        message: 'Cannot select more than 10 order types'
      })
    }

    if (filter.statuses && filter.statuses.length > 15) {
      errors.push({
        field: 'statuses',
        message: 'Cannot select more than 15 statuses'
      })
    }

    if (filter.customerIds && filter.customerIds.length > 50) {
      errors.push({
        field: 'customerIds',
        message: 'Cannot select more than 50 customers'
      })
    }

    // String length validations
    if (filter.searchKey && filter.searchKey.length > 100) {
      errors.push({
        field: 'searchKey',
        message: 'Search term cannot exceed 100 characters'
      })
    }

    if (filter.referenceId && filter.referenceId.length > 50) {
      errors.push({
        field: 'referenceId',
        message: 'Reference ID cannot exceed 50 characters'
      })
    }

    return errors
  }, [])

  // Update current filter with validation
  const updateFilter = useCallback((updates: Partial<OrderAdvancedFilter>) => {
    const newFilter = { ...currentFilter, ...updates }
    const errors = validateFilter(newFilter)
    
    setValidationErrors(errors)
    setCurrentFilter(newFilter)

    return errors.length === 0
  }, [currentFilter, validateFilter])

  // Clear all filters
  const clearFilter = useCallback(() => {
    setCurrentFilter({})
    setValidationErrors([])
  }, [])

  // Remove specific filter field
  const removeFilterField = useCallback((field: keyof OrderAdvancedFilter) => {
    const newFilter = { ...currentFilter }
    delete newFilter[field]
    setCurrentFilter(newFilter)
    
    // Re-validate after removal
    const errors = validateFilter(newFilter)
    setValidationErrors(errors)
  }, [currentFilter, validateFilter])

  // Save current filter as preset
  const saveAsPreset = useCallback(async (name: string, description?: string, isDefault?: boolean) => {
    if (!name.trim()) {
      throw new Error('Preset name is required')
    }

    // Validate current filter before saving
    const errors = validateFilter(currentFilter)
    if (errors.length > 0) {
      throw new Error('Cannot save preset with validation errors')
    }

    // Check for duplicate names
    const existingPreset = savedPresets.find(preset => preset.name.toLowerCase() === name.toLowerCase())
    if (existingPreset) {
      throw new Error('A preset with this name already exists')
    }

    const newPreset: SavedFilterPreset = {
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim(),
      filters: { ...currentFilter },
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // If this is set as default, remove default from others
    let updatedPresets = savedPresets
    if (isDefault) {
      updatedPresets = savedPresets.map(preset => ({ ...preset, isDefault: false }))
    }

    setSavedPresets([...updatedPresets, newPreset])
    return newPreset
  }, [currentFilter, savedPresets, validateFilter, setSavedPresets])

  // Load preset
  const loadPreset = useCallback((presetId: string) => {
    const preset = savedPresets.find(p => p.id === presetId)
    if (preset) {
      setCurrentFilter(preset.filters)
      setValidationErrors([])
      return true
    }
    return false
  }, [savedPresets])

  // Update existing preset
  const updatePreset = useCallback(async (presetId: string, updates: Partial<Omit<SavedFilterPreset, 'id' | 'createdAt'>>) => {
    const presetIndex = savedPresets.findIndex(p => p.id === presetId)
    if (presetIndex === -1) {
      throw new Error('Preset not found')
    }

    const updatedPresets = [...savedPresets]
    updatedPresets[presetIndex] = {
      ...updatedPresets[presetIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // If this is set as default, remove default from others
    if (updates.isDefault) {
      updatedPresets.forEach((preset, index) => {
        if (index !== presetIndex) {
          preset.isDefault = false
        }
      })
    }

    setSavedPresets(updatedPresets)
    return updatedPresets[presetIndex]
  }, [savedPresets, setSavedPresets])

  // Delete preset
  const deletePreset = useCallback((presetId: string) => {
    setSavedPresets(prev => prev.filter(preset => preset.id !== presetId))
  }, [setSavedPresets])

  // Set default preset
  const setDefaultPreset = useCallback((presetId: string) => {
    const updatedPresets = savedPresets.map(preset => ({
      ...preset,
      isDefault: preset.id === presetId
    }))
    setSavedPresets(updatedPresets)
  }, [savedPresets, setSavedPresets])

  // Apply filter and convert to API format
  const applyFilter = useCallback(async (filter: OrderAdvancedFilter = currentFilter) => {
    setIsLoading(true)
    try {
      const errors = validateFilter(filter)
      if (errors.length > 0) {
        setValidationErrors(errors)
        throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`)
      }

      // Helper function to filter out "all" values
      const filterAllValues = (value: any) => {
        if (Array.isArray(value)) {
          return value.filter(v => v !== "all" && v !== "")
        }
        return value !== "all" && value !== "" ? value : undefined
      }

      // Convert to API payload format
      const apiPayload: any = {
        pageIndex: 1,
        pageSize: 50,
      }

      // Basic filters - exclude "all" values
      if (filter.searchKey) apiPayload.searchKey = filter.searchKey
      
      const filteredOrderTypes = filterAllValues(filter.orderTypes)
      if (filteredOrderTypes?.length) apiPayload.orderTypes = filteredOrderTypes
      
      const filteredStatuses = filterAllValues(filter.statuses)
      if (filteredStatuses?.length) apiPayload.statuses = filteredStatuses
      
      const filteredCustomerIds = filterAllValues(filter.customerIds)
      if (filteredCustomerIds?.length) apiPayload.customerId = filteredCustomerIds[0] // API might support only one

      // Date filters
      if (filter.dateType) apiPayload.orderListingFilterType = filter.dateType
      if (filter.fromDate) apiPayload.fromDate = filter.fromDate
      if (filter.toDate) apiPayload.toDate = filter.toDate

      // Location filters
      const filteredLocationIds = filterAllValues(filter.locationIds)
      if (filteredLocationIds?.length) apiPayload.locationId = filteredLocationIds[0]
      
      const filteredTransportationMethodIds = filterAllValues(filter.transportationMethodIds)
      if (filteredTransportationMethodIds?.length) apiPayload.transportationMethodId = filteredTransportationMethodIds[0]

      // Order details
      if (filter.referenceId) apiPayload.referenceId = filter.referenceId
      if (filter.transactionId) apiPayload.transactionId = filter.transactionId

      // Priority - exclude "all"
      const filteredPriority = filterAllValues(filter.priority)
      if (filteredPriority) apiPayload.priority = filteredPriority
      if (filter.trackingNumber) apiPayload.trackingNumber = filter.trackingNumber
      if (filter.sku) apiPayload.sku = filter.sku

      // Address filters
      if (filter.recipientName) apiPayload.recipientName = filter.recipientName
      if (filter.recipientAddress) apiPayload.recipientAddress = filter.recipientAddress
      if (filter.recipientState) apiPayload.recipientState = filter.recipientState
      if (filter.shipperName) apiPayload.shipperName = filter.shipperName
      if (filter.shipperAddress) apiPayload.shipperAddress = filter.shipperAddress
      if (filter.shipperState) apiPayload.shipperState = filter.shipperState

      // Advanced logistics
      if (filter.trailerNumber) apiPayload.trailerNumber = filter.trailerNumber
      if (filter.loadTypeIds?.length) apiPayload.loadTypeId = filter.loadTypeIds[0]
      if (filter.cargoTypeIds?.length) apiPayload.cargoTypeId = filter.cargoTypeIds[0]
      if (filter.trailerTypeIds?.length) apiPayload.trailerTypeId = filter.trailerTypeIds[0]

      return apiPayload
    } finally {
      setIsLoading(false)
    }
  }, [currentFilter, validateFilter])

  // Get filter summary for display
  const getFilterSummary = useCallback((filter: OrderAdvancedFilter = currentFilter) => {
    const summary: string[] = []
    
    if (filter.searchKey) summary.push(`Search: "${filter.searchKey}"`)
    if (filter.orderTypes?.length) summary.push(`Types: ${filter.orderTypes.length} selected`)
    if (filter.statuses?.length) summary.push(`Statuses: ${filter.statuses.length} selected`)
    if (filter.customerIds?.length) summary.push(`Customers: ${filter.customerIds.length} selected`)
    if (filter.fromDate && filter.toDate) summary.push(`Date range selected`)
    if (filter.referenceId) summary.push(`Ref: ${filter.referenceId}`)
    if (filter.sku) summary.push(`SKU: ${filter.sku}`)

    return summary
  }, [currentFilter])

  // Check if filter is empty
  const isEmpty = useCallback((filter: OrderAdvancedFilter = currentFilter) => {
    return Object.keys(filter).length === 0 || 
           Object.values(filter).every(value => 
             value === undefined || 
             value === null || 
             value === '' || 
             (Array.isArray(value) && value.length === 0)
           )
  }, [currentFilter])

  return {
    // State
    currentFilter,
    savedPresets,
    isLoading,
    validationErrors,

    // Actions
    updateFilter,
    clearFilter,
    removeFilterField,
    applyFilter,

    // Presets
    saveAsPreset,
    loadPreset,
    updatePreset,
    deletePreset,
    setDefaultPreset,

    // Utilities
    validateFilter,
    getFilterSummary,
    isEmpty
  }
}
