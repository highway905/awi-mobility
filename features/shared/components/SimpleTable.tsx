import React, { useMemo, useEffect, useRef, useCallback, useState, createContext, useContext, forwardRef, useImperativeHandle } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Types - Unique naming to avoid conflicts
export interface SimpleTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
  headerClassName?: string
  sortable?: boolean
  minWidth?: number
}

// Context for sharing state between compound components
interface SimpleTableContextValue<T> {
  data: T[]
  columns: SimpleTableColumn<T>[]
  isLoading: boolean
  emptyMessage: string
  onRowClick?: (row: T) => void
  // Selection state
  isSelectionMode: boolean
  selectedRows: Set<number>
  enableSelection: boolean
  toggleRowSelection: (index: number) => void
  toggleAllRows: () => void
  getSelectedData: () => T[]
  // Sorting
  sortColumn: string | null
  sortDirection: 'asc' | 'desc' | null
  onSort: (column: string) => void
  // Infinite scroll
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage?: () => void | Promise<void>
}

const SimpleTableContext = createContext<SimpleTableContextValue<any> | null>(null)

function useSimpleTable<T>() {
  const context = useContext(SimpleTableContext) as SimpleTableContextValue<T> | null
  if (!context) {
    throw new Error("SimpleTable compound components must be used within SimpleTable.Root")
  }
  return context
}

// Checkbox component for selection
function Checkbox({ 
  checked, 
  onCheckedChange, 
  className, 
  ...props 
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  [key: string]: any
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={cn(
        "h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  )
}

// Root component that provides context
interface SimpleTableRootProps<T> {
  data: T[]
  columns: SimpleTableColumn<T>[]
  children: React.ReactNode
  className?: string
  onRowClick?: (row: T) => void
  enableSelection?: boolean
  isLoading?: boolean
  emptyMessage?: string
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void | Promise<void>
}

interface SimpleTableRef<T> {
  getSelectedData: () => T[]
  clearSelection: () => void
  selectAll: () => void
}

const SimpleTableRoot = forwardRef<SimpleTableRef<any>, SimpleTableRootProps<any>>(function SimpleTableRoot<T>({
  data = [],
  columns,
  children,
  className,
  onRowClick,
  enableSelection = false,
  isLoading = false,
  emptyMessage = "No data available",
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}: SimpleTableRootProps<T>, ref) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  const safeData = Array.isArray(data) ? data : []
  const safeColumns = Array.isArray(columns) ? columns : []

  // Selection handlers
  const toggleRowSelection = useCallback((rowIndex: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex)
      } else {
        newSet.add(rowIndex)
      }
      return newSet
    })
  }, [])

  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === safeData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(safeData.map((_, index) => index)))
    }
  }, [selectedRows.size, safeData.length])

  const getSelectedData = useCallback(() => {
    return Array.from(selectedRows).map((index) => safeData[index])
  }, [selectedRows, safeData])

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set())
  }, [])

  const selectAll = useCallback(() => {
    setSelectedRows(new Set(safeData.map((_, index) => index)))
  }, [safeData])

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getSelectedData,
    clearSelection,
    selectAll,
  }), [getSelectedData, clearSelection, selectAll])

  // Sorting handler
  const onSort = useCallback((column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }, [sortColumn, sortDirection])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return safeData

    return [...safeData].sort((a, b) => {
      const aValue = a[sortColumn as keyof T]
      const bValue = b[sortColumn as keyof T]

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [safeData, sortColumn, sortDirection])

  const contextValue: SimpleTableContextValue<T> = {
    data: sortedData,
    columns: safeColumns,
    isLoading,
    emptyMessage,
    onRowClick,
    isSelectionMode: enableSelection,
    selectedRows,
    enableSelection,
    toggleRowSelection,
    toggleAllRows,
    getSelectedData,
    sortColumn,
    sortDirection,
    onSort,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }

  return (
    <SimpleTableContext.Provider value={contextValue}>
      <div className={cn("flex flex-col h-full bg-white overflow-hidden", className)}>
        {children}
      </div>
    </SimpleTableContext.Provider>
  )
})

// Container component for the scrollable table
interface SimpleTableContainerProps {
  children: React.ReactNode
  className?: string
}

function SimpleTableContainer({
  children,
  className,
}: SimpleTableContainerProps) {
  const { hasNextPage, fetchNextPage, isFetchingNextPage } = useSimpleTable()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Infinite scroll effect
  useEffect(() => {
    if (!hasNextPage || !fetchNextPage || !tableContainerRef.current) return

    const container = tableContainerRef.current
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        if (!hasNextPage || isFetchingNextPage) return
        const { scrollTop, scrollHeight, clientHeight } = container
        if (scrollHeight - scrollTop - clientHeight < 100) {
          fetchNextPage()
        }
      })
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  return (
    <div
      ref={tableContainerRef}
      className={cn("flex-1 overflow-auto", className)}
    >
      {children}
    </div>
  )
}

// Table component
function SimpleTableTable({ children }: { children: React.ReactNode }) {
  return <table className="w-full border-collapse">{children}</table>
}

// Header component
function SimpleTableHeader() {
  const { columns, enableSelection, selectedRows, data, toggleAllRows, sortColumn, sortDirection, onSort } = useSimpleTable()

  return (
    <thead className="sticky top-0 bg-gray-50 z-10">
      <tr className="border-b border-gray-200">
        {enableSelection && (
          <th className="w-12 px-4 py-3 text-left">
            <div className="flex items-center justify-center">
              <Checkbox
                checked={selectedRows.size === data.length && data.length > 0}
                onCheckedChange={toggleAllRows}
                aria-label="Select all"
              />
            </div>
          </th>
        )}
        {columns.map((column) => {
          const columnKey = typeof column.key === "string" ? column.key : String(column.key)
          const isCurrentSort = sortColumn === columnKey
          
          return (
            <th
              key={columnKey}
              className={cn(
                "px-4 py-3 text-left text-sm font-medium text-gray-600",
                column.headerClassName,
                column.sortable && "cursor-pointer hover:bg-gray-100"
              )}
              style={{ minWidth: column.minWidth || 120 }}
              onClick={column.sortable ? () => onSort(columnKey) : undefined}
            >
              <div className="flex items-center gap-1">
                {column.header}
                {column.sortable && (
                  <div className="ml-1">
                    {isCurrentSort && sortDirection === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : isCurrentSort && sortDirection === "desc" ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronsUpDown className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

// Body component
function SimpleTableBody() {
  const {
    data,
    columns,
    emptyMessage,
    onRowClick,
    enableSelection,
    selectedRows,
    toggleRowSelection,
    isLoading,
    isFetchingNextPage,
  } = useSimpleTable()

  // Show loading state when initially loading
  if (isLoading && data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="h-64">
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Loading...
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    )
  }

  // Show empty state when no data
  if (!data.length && !isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="h-64">
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">
                {emptyMessage}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    )
  }

  const getValue = (row: any, key: keyof any | string): any => {
    if (typeof key === "string" && key.includes(".")) {
      return key.split(".").reduce((obj: any, k) => obj?.[k], row)
    }
    return row[key as keyof any]
  }

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={cn(
            "border-b border-gray-200 hover:bg-gray-50 transition-colors",
            onRowClick && "cursor-pointer",
            enableSelection && selectedRows.has(rowIndex) && "bg-blue-50"
          )}
          onClick={() => onRowClick?.(row)}
        >
          {enableSelection && (
            <td className="w-12 px-4 py-3">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedRows.has(rowIndex)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      toggleRowSelection(rowIndex)
                    } else {
                      toggleRowSelection(rowIndex)
                    }
                  }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                  }}
                  aria-label={`Select row ${rowIndex}`}
                />
              </div>
            </td>
          )}
          {columns.map((column) => {
            const columnKey = typeof column.key === "string" ? column.key : String(column.key)
            const value = getValue(row, column.key)
            
            return (
              <td
                key={columnKey}
                className={cn("px-4 py-3 text-sm", column.className)}
                style={{ minWidth: column.minWidth || 120 }}
              >
                {column.render ? column.render(value, row) : value}
              </td>
            )
          })}
        </tr>
      ))}
      {isFetchingNextPage && (
        <tr>
          <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="h-16 text-center bg-white border-b border-gray-200">
            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Loading more...
              </div>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  )
}

// Loading component
function SimpleTableLoading() {
  const { isLoading, data } = useSimpleTable()

  if (!isLoading || data.length > 0) {
    return null
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500 flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        Loading...
      </div>
    </div>
  )
}

// Export compound component with proper typing
export const SimpleTable = {
  Root: SimpleTableRoot,
  Container: SimpleTableContainer,
  Table: SimpleTableTable,
  Header: SimpleTableHeader,
  Body: SimpleTableBody,
  Loading: SimpleTableLoading,
}

// Export types with unique names
export type { SimpleTableRef }