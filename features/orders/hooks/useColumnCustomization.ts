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
    isLoading: false,
    error: null,
    isDirty: false
  })

  // API hooks
  const { data: columnsData, isLoading: isLoadingColumns, error: fetchError } = useGetCustomColumnsSettingsQuery({
    pageType,
    moduleType: 'order-management'
  })

  const [saveColumnSettings, { isLoading: isSaving }] = useCustomColumnsSettingsMutation()

  // Load columns from API on mount
  useEffect(() => {
    if (columnsData?.success && columnsData?.data) {
      try {
        const apiColumns = columnsData.data.columns || []
        if (apiColumns.length > 0) {
          setState(prev => ({
            ...prev,
            columns: apiColumns.map((col: any, index: number) => ({
              id: col.columnKey || col.id,
              label: col.displayName || col.label,
              visible: col.isVisible !== false,
              order: col.displayOrder !== undefined ? col.displayOrder : index,
              width: col.width || getDefaultWidth(col.columnKey || col.id),
              pinned: col.isPinned ? (col.pinnedSide || 'left') : null
            })).sort((a: OrderColumnConfig, b: OrderColumnConfig) => a.order - b.order)
          }))
        }
      } catch (error) {
        console.warn('Failed to parse column settings:', error)
        setState(prev => ({ ...prev, error: 'Failed to load column settings' }))
      }
    }
  }, [columnsData])

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

  // Save column settings to API
  const saveColumns = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const payload = {
        pageType,
        moduleType: 'order-management',
        columns: state.columns.map(col => ({
          columnKey: col.id,
          displayName: col.label,
          isVisible: col.visible,
          displayOrder: col.order,
          width: col.width,
          isPinned: col.pinned !== null,
          pinnedSide: col.pinned || 'left'
        }))
      }

      const result = await saveColumnSettings(payload).unwrap()
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          isDirty: false, 
          isLoading: false,
          error: null 
        }))
        return { success: true }
      } else {
        throw new Error(result.message || 'Failed to save column settings')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to save column settings'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }))
      return { success: false, error: errorMessage }
    }
  }, [state.columns, pageType, saveColumnSettings])

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
    isLoading: state.isLoading || isLoadingColumns || isSaving,
    error: state.error || fetchError,
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
