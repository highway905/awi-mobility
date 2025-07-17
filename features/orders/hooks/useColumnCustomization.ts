"use client"

import { useState, useCallback, useEffect } from "react"
import { useCustomColumnsSettingsMutation, useGetCustomColumnsSettingsQuery } from "@/lib/redux/api/commonApi"

export interface OrderColumnConfig {
  id: string
  label: string
  visible: boolean
  order: number
  width?: number
  pinned?: 'left' | 'right' | null
}

export interface ColumnCustomizationState {
  columns: OrderColumnConfig[]
  isLoading: boolean
  error: string | null
  isDirty: boolean
}

const DEFAULT_COLUMNS: OrderColumnConfig[] = [
  { id: "transactionId", label: "Transaction ID", visible: true, order: 0, width: 140, pinned: 'left' },
  { id: "customer", label: "Customer", visible: true, order: 1, width: 136 },
  { id: "orderType", label: "Order Type", visible: true, order: 2, width: 110 },
  { id: "referenceId", label: "Reference ID", visible: true, order: 3, width: 136 },
  { id: "channel", label: "Channel", visible: true, order: 4, width: 110 },
  { id: "appointmentDate", label: "Appointment Date", visible: true, order: 5, width: 160 },
  { id: "status", label: "Status", visible: true, order: 6, width: 140 },
]

export function useColumnCustomization(pageType: string = 'orders') {
  const [state, setState] = useState<ColumnCustomizationState>({
    columns: DEFAULT_COLUMNS,
    isLoading: false, // Set to false since we're not making API calls
    error: null,
    isDirty: false
  })

  // API hooks - DISABLED to always use base columns
  const { data: columnsData, isLoading: isLoadingColumns, error: fetchError } = useGetCustomColumnsSettingsQuery({
    pageType,
    moduleType: 'order-management'
  }, {
    skip: true // Skip API call to always use base columns
  })

  const [saveColumnSettings, { isLoading: isSaving }] = useCustomColumnsSettingsMutation()

  // Load columns - DISABLED API loading, always use defaults
  useEffect(() => {
    // Always use default columns, ignore API response
    setState(prev => ({
      ...prev,
      columns: [...DEFAULT_COLUMNS],
      isLoading: false,
      error: null
    }))
  }, []) // Remove dependencies to prevent API-based updates

  // Helper function to get default width
  const getDefaultWidth = (columnId: string): number => {
    const defaultCol = DEFAULT_COLUMNS.find(col => col.id === columnId)
    return defaultCol?.width || 120
  }

  // Toggle column visibility
  const toggleColumn = useCallback((columnId: string) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      ),
      isDirty: true
    }))
  }, [])

  // Reorder columns
  const reorderColumns = useCallback((startIndex: number, endIndex: number) => {
    setState(prev => {
      const newColumns = [...prev.columns]
      const [removed] = newColumns.splice(startIndex, 1)
      newColumns.splice(endIndex, 0, removed)
      
      // Update order values
      const reorderedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index
      }))

      return {
        ...prev,
        columns: reorderedColumns,
        isDirty: true
      }
    })
  }, [])

  // Update column width
  const updateColumnWidth = useCallback((columnId: string, width: number) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === columnId ? { ...col, width: Math.max(width, 60) } : col
      ),
      isDirty: true
    }))
  }, [])

  // Pin/unpin column
  const pinColumn = useCallback((columnId: string, side: 'left' | 'right' | null) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === columnId ? { ...col, pinned: side } : col
      ),
      isDirty: true
    }))
  }, [])

  // Reset to defaults
  const resetColumns = useCallback(() => {
    setState(prev => ({
      ...prev,
      columns: [...DEFAULT_COLUMNS],
      isDirty: true
    }))
  }, [])

  // Save column settings - DISABLED
  const saveColumns = useCallback(async () => {
    // Column customization disabled - do nothing
    console.log('Column save is disabled')
    return { success: true }
  }, [])

  // Get visible columns in order
  const getVisibleColumns = useCallback(() => {
    return state.columns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order)
  }, [state.columns])

  // Get sticky columns configuration
  const getStickyColumns = useCallback(() => {
    const left = state.columns.filter(col => col.visible && col.pinned === 'left').map(col => col.id)
    const right = state.columns.filter(col => col.visible && col.pinned === 'right').map(col => col.id)
    
    return {
      left: left.length > 0 ? left : undefined,
      right: right.length > 0 ? right : undefined
    }
  }, [state.columns])

  return {
    // State
    columns: state.columns,
    visibleColumns: getVisibleColumns(),
    stickyColumns: getStickyColumns(),
    isLoading: false, // Always false since API is disabled
    error: null, // Always null since API is disabled
    isDirty: state.isDirty,
    
    // Actions
    toggleColumn,
    reorderColumns,
    updateColumnWidth,
    pinColumn,
    resetColumns,
    saveColumns
  }
}
