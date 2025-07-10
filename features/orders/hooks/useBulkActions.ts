"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export interface BulkAction {
  id: string
  label: string
  icon?: React.ReactNode
  description?: string
  confirmMessage?: string
  requiresConfirmation?: boolean
  isDestructive?: boolean
  isDisabled?: boolean
  handler: (selectedItems: any[]) => Promise<BulkActionResult>
}

export interface BulkActionResult {
  success: boolean
  message?: string
  successCount?: number
  failureCount?: number
  errors?: string[]
}

export interface BulkActionsState {
  selectedItems: Set<string>
  isLoading: boolean
  lastAction?: string
  actionProgress?: {
    current: number
    total: number
    action: string
  }
}

export function useBulkActions<T extends { id?: string; [key: string]: any }>() {
  const { toast } = useToast()
  const [state, setState] = useState<BulkActionsState>({
    selectedItems: new Set(),
    isLoading: false,
  })

  // Selection management
  const selectItem = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      selectedItems: new Set([...prev.selectedItems, itemId])
    }))
  }, [])

  const deselectItem = useCallback((itemId: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedItems)
      newSelected.delete(itemId)
      return {
        ...prev,
        selectedItems: newSelected
      }
    })
  }, [])

  const toggleItem = useCallback((itemId: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedItems)
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId)
      } else {
        newSelected.add(itemId)
      }
      return {
        ...prev,
        selectedItems: newSelected
      }
    })
  }, [])

  const selectAll = useCallback((items: T[]) => {
    const allIds = items.map(item => item.id || '').filter(Boolean)
    setState(prev => ({
      ...prev,
      selectedItems: new Set(allIds)
    }))
  }, [])

  const deselectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedItems: new Set()
    }))
  }, [])

  const selectRange = useCallback((items: T[], startIndex: number, endIndex: number) => {
    const rangeItems = items.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1
    )
    const rangeIds = rangeItems.map(item => item.id || '').filter(Boolean)
    
    setState(prev => ({
      ...prev,
      selectedItems: new Set([...prev.selectedItems, ...rangeIds])
    }))
  }, [])

  // Execute bulk action with progress tracking
  const executeBulkAction = useCallback(async (
    action: BulkAction,
    selectedData: T[],
    showConfirmation: boolean = true
  ) => {
    if (selectedData.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to perform this action",
        variant: "destructive",
      })
      return { success: false, message: "No items selected" }
    }

    // Confirmation dialog for destructive actions
    if (showConfirmation && action.requiresConfirmation) {
      const confirmMessage = action.confirmMessage || 
        `Are you sure you want to ${action.label.toLowerCase()} ${selectedData.length} item(s)?`
      
      if (!window.confirm(confirmMessage)) {
        return { success: false, message: "Action cancelled" }
      }
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true,
      lastAction: action.id,
      actionProgress: {
        current: 0,
        total: selectedData.length,
        action: action.label
      }
    }))

    try {
      // Execute action with progress updates
      const result = await action.handler(selectedData)

      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        actionProgress: undefined
      }))

      // Show result toast
      if (result.success) {
        toast({
          title: "Action Completed",
          description: result.message || 
            `Successfully ${action.label.toLowerCase()} ${result.successCount || selectedData.length} item(s)`,
        })

        // Clear selection after successful action
        deselectAll()
      } else {
        toast({
          title: "Action Failed",
          description: result.message || `Failed to ${action.label.toLowerCase()} items`,
          variant: "destructive",
        })
      }

      return result
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        actionProgress: undefined
      }))

      const errorMessage = error.message || `Failed to ${action.label.toLowerCase()} items`
      toast({
        title: "Action Error",
        description: errorMessage,
        variant: "destructive",
      })

      return { success: false, message: errorMessage }
    }
  }, [toast, deselectAll])

  // Update progress during bulk operation
  const updateProgress = useCallback((current: number, total: number) => {
    setState(prev => ({
      ...prev,
      actionProgress: prev.actionProgress ? {
        ...prev.actionProgress,
        current,
        total
      } : undefined
    }))
  }, [])

  // Check if item is selected
  const isSelected = useCallback((itemId: string) => {
    return state.selectedItems.has(itemId)
  }, [state.selectedItems])

  // Get selected items data
  const getSelectedItems = useCallback((allItems: T[]) => {
    return allItems.filter(item => item.id && state.selectedItems.has(item.id))
  }, [state.selectedItems])

  // Check if all items are selected
  const isAllSelected = useCallback((items: T[]) => {
    const validItems = items.filter(item => item.id)
    return validItems.length > 0 && validItems.every(item => item.id && state.selectedItems.has(item.id))
  }, [state.selectedItems])

  // Check if some items are selected (for indeterminate state)
  const isSomeSelected = useCallback((items: T[]) => {
    return state.selectedItems.size > 0 && !isAllSelected(items)
  }, [state.selectedItems, isAllSelected])

  return {
    // State
    selectedItems: state.selectedItems,
    selectedCount: state.selectedItems.size,
    isLoading: state.isLoading,
    lastAction: state.lastAction,
    actionProgress: state.actionProgress,

    // Selection actions
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    selectRange,

    // Bulk actions
    executeBulkAction,
    updateProgress,

    // Utilities
    isSelected,
    getSelectedItems,
    isAllSelected,
    isSomeSelected,
  }
}

// Common bulk actions for orders
export const createOrderBulkActions = (onRefresh?: () => void): BulkAction[] => [
  {
    id: 'export',
    label: 'Export Selected',
    description: 'Export selected orders to CSV/Excel',
    handler: async (selectedItems) => {
      // Mock export functionality
      return new Promise((resolve) => {
        setTimeout(() => {
          // In real implementation, this would call export API
          resolve({
            success: true,
            message: `Exported ${selectedItems.length} orders`,
            successCount: selectedItems.length
          })
        }, 2000)
      })
    }
  },
  {
    id: 'update-status',
    label: 'Update Status',
    description: 'Bulk update status of selected orders',
    requiresConfirmation: true,
    handler: async (selectedItems) => {
      // Mock status update
      return new Promise((resolve) => {
        setTimeout(() => {
          const successCount = Math.floor(selectedItems.length * 0.9) // 90% success rate
          const failureCount = selectedItems.length - successCount
          
          resolve({
            success: successCount > 0,
            message: failureCount > 0 
              ? `Updated ${successCount} orders, ${failureCount} failed`
              : `Updated ${successCount} orders`,
            successCount,
            failureCount
          })
          
          onRefresh?.()
        }, 3000)
      })
    }
  },
  {
    id: 'cancel',
    label: 'Cancel Orders',
    description: 'Cancel selected orders',
    requiresConfirmation: true,
    isDestructive: true,
    confirmMessage: 'Are you sure you want to cancel the selected orders? This action cannot be undone.',
    handler: async (selectedItems) => {
      // Mock cancel functionality
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: `Cancelled ${selectedItems.length} orders`,
            successCount: selectedItems.length
          })
          
          onRefresh?.()
        }, 2500)
      })
    }
  },
  {
    id: 'assign',
    label: 'Assign to User',
    description: 'Assign selected orders to a user',
    requiresConfirmation: true,
    handler: async (selectedItems) => {
      // Mock assignment functionality
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: `Assigned ${selectedItems.length} orders`,
            successCount: selectedItems.length
          })
          
          onRefresh?.()
        }, 1500)
      })
    }
  },
  {
    id: 'duplicate',
    label: 'Duplicate Orders',
    description: 'Create duplicates of selected orders',
    requiresConfirmation: true,
    handler: async (selectedItems) => {
      // Mock duplication functionality
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: `Duplicated ${selectedItems.length} orders`,
            successCount: selectedItems.length
          })
          
          onRefresh?.()
        }, 4000)
      })
    }
  },
  {
    id: 'send-notification',
    label: 'Send Notifications',
    description: 'Send email notifications for selected orders',
    handler: async (selectedItems) => {
      // Mock notification functionality
      return new Promise((resolve) => {
        setTimeout(() => {
          const successCount = Math.floor(selectedItems.length * 0.95) // 95% success rate
          const failureCount = selectedItems.length - successCount
          
          resolve({
            success: true,
            message: failureCount > 0 
              ? `Sent ${successCount} notifications, ${failureCount} failed`
              : `Sent ${successCount} notifications`,
            successCount,
            failureCount
          })
        }, 2000)
      })
    }
  }
]
