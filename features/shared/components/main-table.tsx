"use client"

import type React from "react"
import { EnhancedTable, type EnhancedTableColumn } from "./enhanced-table"

export interface MainTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
  headerClassName?: string
  sortable?: boolean
  minWidth?: number
  sticky?: "left" | "right"
}

interface MainTableProps<T> {
  data: T[]
  columns: MainTableColumn<T>[]
  className?: string
  onRowClick?: (row: T) => void
  // Infinite scroll props
  hasNextPage?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
  // Sticky columns configuration
  stickyColumns?: {
    left?: string[] // column keys
    right?: string[] // column keys
  }
  // Footer data for totals
  footerData?: Record<string, any>
  // Loading state
  isLoading?: boolean
  // Empty state
  emptyMessage?: string
  redirectEnabled?: boolean // Control redirect on row click
  // Bulk selection props
  enableBulkSelection?: boolean // NEW: Control bulk selection feature
  onBulkAction?: (action: string, selectedRows: T[]) => void
  bulkActions?: Array<{
    id: string
    label: string
    icon?: React.ReactNode
    variant?: "default" | "destructive"
  }>
}

export function MainTable<T>({
  data = [],
  columns,
  className,
  onRowClick,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  stickyColumns,
  footerData,
  isLoading,
  emptyMessage = "No data available",
  redirectEnabled = true,
  enableBulkSelection = false,
  onBulkAction,
  bulkActions,
}: MainTableProps<T>) {
  const getValue = (row: T, key: keyof T | string): any => {
    if (typeof key === "string" && key.includes(".")) {
      return key.split(".").reduce((obj: any, k) => obj?.[k], row)
    }
    return row[key as keyof T]
  }

  const safeData = Array.isArray(data) ? data : []
  const safeColumns = Array.isArray(columns) ? columns : []

  // Convert MainTableColumn to TanStack column format
  const tanstackColumns: EnhancedTableColumn<T>[] = safeColumns.map((column, index) => ({
    id: typeof column.key === "string" ? column.key : String(column.key),
    accessorFn: (row) => getValue(row, column.key),
    header: column.header,
    cell: ({ getValue, row }) => {
      const value = getValue()
      return column.render ? column.render(value, row.original) : value
    },
    enableSorting: column.sortable ?? false,
    minWidth: column.minWidth,
    sticky: column.sticky,
  }))

  return (
    <EnhancedTable
      data={safeData}
      columns={tanstackColumns}
      className={className}
      redirectEnabled={redirectEnabled}
      onRowClick={onRowClick}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      stickyColumns={stickyColumns}
      footerData={footerData}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      enableBulkSelection={enableBulkSelection}
      onBulkAction={onBulkAction}
      bulkActions={bulkActions}
    />
  )
}