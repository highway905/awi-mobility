"use client"

import { useState, useCallback } from "react"

export interface ColumnConfig {
  id: string
  label: string
  visible: boolean
  order: number
}

export function useColumnCustomization(initialColumns: ColumnConfig[]) {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns)

  const toggleColumn = useCallback((columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, visible: !col.visible } : col)))
  }, [])

  const resetColumns = useCallback(() => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })))
  }, [])

  const reorderColumns = useCallback((startIndex: number, endIndex: number) => {
    setColumns((prev) => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)

      // Update order values
      return result.map((col, index) => ({ ...col, order: index }))
    })
  }, [])

  const getSortedColumns = useCallback(() => {
    return [...columns].sort((a, b) => a.order - b.order)
  }, [columns])

  return {
    columns,
    toggleColumn,
    resetColumns,
    reorderColumns,
    getSortedColumns,
    setColumns,
  }
}
