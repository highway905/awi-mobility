"use client"

import React, { useMemo, useEffect, useRef, useCallback, useState, createContext, useContext } from "react"
import type { Table, Row, Column } from "@tanstack/react-table"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ChevronUp, ChevronDown, ChevronsUpDown, X, UserPlus, CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
export interface AdvancedTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
  headerClassName?: string
  sortable?: boolean
  minWidth?: number
  sticky?: "left" | "right"
  align?: "left" | "center" | "right"
}

interface BulkAction {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: "default" | "destructive"
}

// Context for sharing state between compound components
interface AdvancedTableContextValue<T> {
  table: Table<T>
  data: T[]
  columns: ColumnDef<T, any>[]
  isLoading: boolean
  emptyMessage: string
  onRowClick?: (row: T) => void
  redirectEnabled: boolean
  // Selection state
  isSelectionMode: boolean
  selectedRows: Set<number>
  enableBulkSelection: boolean
  toggleRowSelection: (index: number) => void
  toggleAllRows: () => void
  exitSelectionMode: () => void
  // Sticky columns
  stickyColumns?: {
    left?: string[]
    right?: string[]
  }
  getStickyStyles: (columnId: string, isFooter?: boolean) => React.CSSProperties
  // Bulk actions
  bulkActions?: BulkAction[]
  onBulkAction?: (action: string, selectedRows: T[]) => void
  handleBulkAction: (actionId: string) => void
  // Long press handling
  handlePressStart: (rowIndex: number, event: React.MouseEvent | React.TouchEvent) => void
  handlePressEnd: () => void
  handlePressCancel: () => void
  handleRowClick: (row: T, rowIndex: number, event: React.MouseEvent) => void
  isLongPressing: boolean
  pressStartTime: number
  // Infinite scroll
  hasNextPage: boolean
  isFetchingNextPage: boolean
  // Controlled sorting
  sorting: SortingState
  onSortingChange?: (sorting: SortingState) => void
  manualSorting: boolean
}

const AdvancedTableContext = createContext<AdvancedTableContextValue<any> | null>(null)

function useAdvancedTable<T>() {
  const context = useContext(AdvancedTableContext) as AdvancedTableContextValue<T> | null
  if (!context) {
    throw new Error("AdvancedTable compound components must be used within AdvancedTable.Root")
  }
  return context
}

// Skeleton Row Component
function SkeletonRow({ columnsCount, enableSelection }: { columnsCount: number; enableSelection: boolean }) {
  return (
    <tr className="border-b border-gray-100 bg-white/50 animate-pulse" style={{ height: "48px", minHeight: "48px", maxHeight: "48px" }}>
      {enableSelection && (
        <td className="px-4" style={{ height: "48px", minHeight: "48px", maxHeight: "48px", padding: "0 16px", lineHeight: "48px", verticalAlign: "middle" }}>
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </td>
      )}
      {Array.from({ length: columnsCount }).map((_, index) => (
        <td key={index} className="px-4" style={{ height: "48px", minHeight: "48px", maxHeight: "48px", padding: "0 16px", lineHeight: "48px", verticalAlign: "middle" }}>
          <div className="flex items-center">
            <div 
              className="h-4 bg-gray-300 rounded-md animate-pulse"
              style={{ 
                width: `${Math.random() * 40 + 40}%`, // Random width between 40-80%
                animationDelay: `${index * 0.1}s`,
                animationDuration: '1.8s'
              }}
            ></div>
          </div>
        </td>
      ))}
    </tr>
  )
}

// Skeleton Loading Component with proper height fitting
function TableSkeleton({ rowCount = 10 }: { rowCount?: number }) {
  const { columns, enableBulkSelection, isSelectionMode } = useAdvancedTable()
  
  const actualColumns = columns.filter((col: any) => col.id !== "select")
  const showSelection = enableBulkSelection && isSelectionMode

  // Calculate a reasonable number of rows based on typical viewport
  // Each row is 48px (h-12), so ~8-10 rows should fit in most viewports
  const visibleRowCount = Math.min(rowCount, 10)

  return (
    <tbody>
      {Array.from({ length: visibleRowCount }).map((_, index) => (
        <SkeletonRow 
          key={`skeleton-${index}`} 
          columnsCount={actualColumns.length} 
          enableSelection={showSelection}
        />
      ))}
    </tbody>
  )
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

// Button component
function Button({ 
  children, 
  onClick, 
  className, 
  size = "default",
  ...props 
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: "sm" | "default"
  [key: string]: any
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4 py-2",
        "bg-blue-600 text-white hover:bg-blue-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Root component that provides context
interface AdvancedTableRootProps<T> {
  data: T[]
  columns: AdvancedTableColumn<T>[]
  children: React.ReactNode
  className?: string
  onRowClick?: (row: T) => void
  redirectEnabled?: boolean
  enableBulkSelection?: boolean
  onBulkAction?: (action: string, selectedRows: T[]) => void
  bulkActions?: BulkAction[]
  stickyColumns?: {
    left?: string[]
    right?: string[]
  }
  isLoading?: boolean
  emptyMessage?: string
  // Controlled sorting props
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  manualSorting?: boolean
}

function AdvancedTableRoot<T>({
  data = [],
  columns,
  children,
  className,
  onRowClick,
  redirectEnabled = true,
  enableBulkSelection = false,
  onBulkAction,
  bulkActions = [],
  stickyColumns,
  isLoading = false,
  emptyMessage = "No data available",
  // Controlled sorting props
  sorting: controlledSorting,
  onSortingChange,
  manualSorting = false,
}: AdvancedTableRootProps<T>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Use controlled sorting if provided, otherwise use internal state
  const sorting = controlledSorting !== undefined ? controlledSorting : internalSorting
  const handleSortingChange = onSortingChange || setInternalSorting

  // Selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [pressStartTime, setPressStartTime] = useState<number>(0)

  const safeData = Array.isArray(data) ? data : []
  const safeColumns = Array.isArray(columns) ? columns : []

  // Convert AdvancedTableColumn to TanStack column format
  const getValue = (row: T, key: keyof T | string): any => {
    if (typeof key === "string" && key.includes(".")) {
      return key.split(".").reduce((obj: any, k) => obj?.[k], row)
    }
    return row[key as keyof T]
  }

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

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false)
    setSelectedRows(new Set())
  }, [])

  const handleBulkAction = useCallback(
    (actionId: string) => {
      const selectedData = Array.from(selectedRows).map((index) => safeData[index])
      onBulkAction?.(actionId, selectedData)
      exitSelectionMode()
    },
    [selectedRows, safeData, onBulkAction, exitSelectionMode],
  )

  // Improved long press handlers for bulk selection
  const handlePressStart = useCallback(
    (rowIndex: number, event: React.MouseEvent | React.TouchEvent) => {
      if (!enableBulkSelection) return

      // Prevent default to avoid text selection
      event.preventDefault()

      const currentTime = Date.now()
      setPressStartTime(currentTime)
      setIsLongPressing(false)

      // Clear any existing timer
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }

      // Set up long press timer - only for bulk selection
      const timer = setTimeout(() => {
        setIsLongPressing(true)
        setIsSelectionMode(true)
        setSelectedRows(new Set([rowIndex]))
        
        // Add haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50)
        }
      }, 500)

      setLongPressTimer(timer)
    },
    [enableBulkSelection, longPressTimer],
  )

  const handlePressEnd = useCallback(() => {
    if (!enableBulkSelection) return

    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Small delay to prevent immediate state reset
    setTimeout(() => {
      setIsLongPressing(false)
      setPressStartTime(0)
    }, 50)
  }, [enableBulkSelection, longPressTimer])

  const handlePressCancel = useCallback(() => {
    if (!enableBulkSelection) return

    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    setIsLongPressing(false)
    setPressStartTime(0)
  }, [enableBulkSelection, longPressTimer])

  const handleRowClick = useCallback(
    (row: T, rowIndex: number, event: React.MouseEvent) => {
      // If we're in the middle of a long press, prevent click
      if (isLongPressing) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      // If we're in selection mode, toggle selection instead of redirecting
      if (isSelectionMode) {
        event.preventDefault()
        toggleRowSelection(rowIndex)
        return
      }

      // If we just finished a long press (within 200ms), don't trigger click
      if (enableBulkSelection && pressStartTime > 0 && Date.now() - pressStartTime < 200) {
        event.preventDefault()
        return
      }

      // Normal row click - redirect to new page
      if (onRowClick) {
        onRowClick(row)
      }
    },
    [
      isLongPressing,
      isSelectionMode,
      toggleRowSelection,
      pressStartTime,
      onRowClick,
      enableBulkSelection,
    ],
  )

  // Checkbox column for selection
  const checkboxColumn = useMemo(
    () => ({
      id: "select",
      header: () => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selectedRows.size === safeData.length && safeData.length > 0}
            onCheckedChange={toggleAllRows}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }: { row: Row<T> }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selectedRows.has(row.index)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedRows(prev => new Set([...prev, row.index]))
              } else {
                setSelectedRows(prev => {
                  const newSet = new Set(prev)
                  newSet.delete(row.index)
                  return newSet
                })
              }
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
            }}
            aria-label={`Select row ${row.index}`}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      minWidth: 50,
      sticky: "left",
    }),
    [selectedRows, safeData.length, toggleAllRows],
  )

  // Convert columns to TanStack format
  const tanstackColumns = useMemo(() => {
    const baseColumns = safeColumns.map((column) => ({
      id: typeof column.key === "string" ? column.key : String(column.key),
      accessorFn: (row: T) => getValue(row, column.key),
      header: column.header,
      cell: ({ getValue, row }: any) => {
        const value = getValue()
        return column.render ? column.render(value, row.original) : value
      },
      enableSorting: column.sortable ?? false,
      minWidth: column.minWidth,
      sticky: column.sticky,
    }))

    return enableBulkSelection && isSelectionMode ? [checkboxColumn, ...baseColumns] : baseColumns
  }, [safeColumns, enableBulkSelection, isSelectionMode, checkboxColumn])

  // Sticky styles calculator with box shadows
  const getStickyStyles = useCallback(
    (columnId: string, isFooter: boolean = false) => {
      // Return empty styles if no sticky columns are configured
      if (!stickyColumns || (!stickyColumns.left && !stickyColumns.right)) {
        return {}
      }

      const leftColumns =
        enableBulkSelection && isSelectionMode ? ["select", ...(stickyColumns.left || [])] : stickyColumns.left || []

      if (leftColumns.includes(columnId)) {
        const index = leftColumns.indexOf(columnId)
        const leftOffset = leftColumns.slice(0, index).reduce((acc, id) => {
          if (id === "select") return acc + 50
          const col = safeColumns.find((c) => (typeof c.key === "string" ? c.key : String(c.key)) === id)
          return acc + (col?.minWidth || 120)
        }, 0)

        // Check if this is the first left sticky column to add left shadow
        const isFirstLeftColumn = index === 0

        return {
          position: "sticky" as const,
          left: leftOffset,
          zIndex: isFooter ? 50 : 20,
          backgroundColor: "inherit",
          boxShadow: isFirstLeftColumn ? "-4px 0 1px -3px hsl(240 5.9% 90%) inset" : "none",
        }
      }

      if (stickyColumns.right?.includes(columnId)) {
        const index = stickyColumns.right.indexOf(columnId)
        const rightOffset = stickyColumns.right.slice(index + 1).reduce((acc, id) => {
          const col = safeColumns.find((c) => (typeof c.key === "string" ? c.key : String(c.key)) === id)
          return acc + (col?.minWidth || 120)
        }, 0)

        // Check if this is the first right sticky column to add left shadow
        const isFirstRightColumn = index === 0

        return {
          position: "sticky" as const,
          right: rightOffset,
          zIndex: isFooter ? 110 : 20,
          backgroundColor: "inherit",
          boxShadow: isFirstRightColumn ? "-4px 0 1px -3px hsl(240 5.9% 90%) inset" : "none",
        }
      }

      return {}
    },
    [stickyColumns, safeColumns, enableBulkSelection, isSelectionMode],
  )

  const table = useReactTable({
    data: safeData,
    columns: tanstackColumns as ColumnDef<T, any>[],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualSorting: manualSorting,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: 0,
        pageSize: safeData.length > 0 ? safeData.length : 100,
      },
    },
    manualPagination: true,
  })

  const contextValue: AdvancedTableContextValue<T> = {
    table,
    data: safeData,
    columns: tanstackColumns,
    isLoading,
    emptyMessage,
    onRowClick,
    redirectEnabled,
    isSelectionMode,
    selectedRows,
    enableBulkSelection,
    toggleRowSelection,
    toggleAllRows,
    exitSelectionMode,
    stickyColumns,
    getStickyStyles,
    bulkActions,
    onBulkAction,
    handleBulkAction,
    handlePressStart,
    handlePressEnd,
    handlePressCancel,
    handleRowClick,
    isLongPressing,
    pressStartTime,
    hasNextPage: false,
    isFetchingNextPage: false,
    sorting,
    onSortingChange: handleSortingChange,
    manualSorting,
  }

  return (
    <AdvancedTableContext.Provider value={contextValue}>
      <div className={cn("flex flex-col h-full rounded-lg border border-gray-200 bg-white overflow-hidden relative", className)}>
        {children}
      </div>
    </AdvancedTableContext.Provider>
  )
}

// Container component for the scrollable table
interface AdvancedTableContainerProps {
  children: React.ReactNode
  hasNextPage?: boolean
  fetchNextPage?: () => void | Promise<void>
  isFetchingNextPage?: boolean
  className?: string
}

function AdvancedTableContainer({
  children,
  hasNextPage = false,
  fetchNextPage,
  isFetchingNextPage = false,
  className,
}: AdvancedTableContainerProps) {
  const { enableBulkSelection, pressStartTime } = useAdvancedTable()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Update context with infinite scroll props
  const context = useContext(AdvancedTableContext)
  if (context) {
    context.hasNextPage = hasNextPage
    context.isFetchingNextPage = isFetchingNextPage
  }

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
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-auto"
        style={{
          WebkitUserSelect: enableBulkSelection && pressStartTime > 0 ? "none" : "auto",
          userSelect: enableBulkSelection && pressStartTime > 0 ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Table component - FIXED: Proper table layout without nested divs
function AdvancedTableTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse advanced-table" style={{ tableLayout: 'auto' }}>
      {children}
    </table>
  )
}

// Header component
function AdvancedTableHeader() {
  const { table, getStickyStyles, columns, sorting, onSortingChange, manualSorting } = useAdvancedTable()

  return (
    <thead className="sticky top-0 bg-white z-30 shadow-sm">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b border-gray-200" style={{ height: "48px", minHeight: "48px", maxHeight: "48px" }}>
          {headerGroup.headers.map((header) => {
            const stickyStyles = getStickyStyles(header.column.id, false)
            const column = columns.find((c: any) => c.id === header.column.id)

            return (
              <th
                key={header.id}
                className={cn(
                  "px-4 text-left align-middle text-sm font-medium text-gray-600 bg-white",
                  stickyStyles.position && "z-20",
                )}
                style={{
                  ...stickyStyles,
                  backgroundColor: "white",
                  position: "sticky",
                  top: 0,
                  zIndex: stickyStyles.position ? 40 : 30,
                  height: "48px",
                  minHeight: "48px",
                  maxHeight: "48px",
                  padding: "12px 16px",
                  verticalAlign: "middle",
                  width: (column as any)?.minWidth ? `${(column as any).minWidth}px` : undefined,
                  minWidth: (column as any)?.minWidth ? `${(column as any).minWidth}px` : undefined,
                }}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex items-center gap-1 h-full">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {header.column.getCanSort() && (
                      <button
                        onClick={(event) => {
                          if (manualSorting && onSortingChange) {
                            const currentSort = sorting.find(s => s.id === header.column.id)
                            let newSorting: typeof sorting = []
                            
                            if (!currentSort) {
                              // No current sort, set to ascending
                              newSorting = [{ id: header.column.id, desc: false }]
                            } else if (!currentSort.desc) {
                              // Currently ascending, set to descending
                              newSorting = [{ id: header.column.id, desc: true }]
                            } else {
                              // Currently descending, remove sort
                              newSorting = []
                            }
                            
                            onSortingChange(newSorting)
                          } else {
                            // Use default TanStack behavior for client-side sorting
                            header.column.getToggleSortingHandler()?.(event)
                          }
                        }}
                        className="ml-1 hover:bg-gray-100 rounded p-1 flex-shrink-0"
                      >
                        {header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronsUpDown className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}

// Body component - FIXED: Proper alignment and expansion with skeleton loading
function AdvancedTableBody() {
  const {
    table,
    getStickyStyles,
    columns,
    emptyMessage,
    handleRowClick,
    handlePressStart,
    handlePressEnd,
    handlePressCancel,
    enableBulkSelection,
    isSelectionMode,
    selectedRows,
    onRowClick,
    isFetchingNextPage,
    isLoading,
    data,
  } = useAdvancedTable()

  const rows = table.getRowModel().rows

  // Show skeleton loading when initially loading
  if (isLoading && data.length === 0) {
    return <TableSkeleton rowCount={10} />
  }

  // Show empty state when no data
  if (!rows.length && !isLoading) {
    return (
      <tbody className="h-full">
        <tr className="h-full">
          <td colSpan={columns.length} className="h-full">
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-gray-500">
                {emptyMessage}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody className="align-top">
      {rows.map((row) => (
        <tr
          key={row.id}
          className={cn(
            "border-b border-gray-200 text-sm hover:bg-gray-50/50 transition-colors",
            enableBulkSelection ? "select-none" : "",
            onRowClick ? "cursor-pointer" : "",
            enableBulkSelection && selectedRows.has(row.index) && "bg-blue-50",
          )}
          style={{ 
            height: "48px", 
            minHeight: "48px", 
            maxHeight: "48px",
          }}
          onClick={(e) => handleRowClick(row.original, row.index, e)}
          onMouseDown={
            enableBulkSelection
              ? (e) => handlePressStart(row.index, e)
              : undefined
          }
          onMouseUp={enableBulkSelection ? handlePressEnd : undefined}
          onMouseLeave={enableBulkSelection ? handlePressCancel : undefined}
          onTouchStart={
            enableBulkSelection
              ? (e) => handlePressStart(row.index, e)
              : undefined
          }
          onTouchEnd={enableBulkSelection ? handlePressEnd : undefined}
          onTouchCancel={enableBulkSelection ? handlePressCancel : undefined}
          onContextMenu={enableBulkSelection ? (e) => e.preventDefault() : undefined}
        >
          {row.getVisibleCells().map((cell) => {
            const stickyStyles = getStickyStyles(cell.column.id, false)
            const column = columns.find((c: any) => c.id === cell.column.id)

            return (
              <td
                key={cell.id}
                className={cn(
                  "px-4 align-middle bg-white",
                  stickyStyles.position && "z-10"
                )}
                style={{
                  ...stickyStyles,
                  backgroundColor: "white",
                  height: "48px",
                  minHeight: "48px",
                  maxHeight: "48px",
                  padding: "0 16px",
                  lineHeight: "48px",
                  verticalAlign: "middle",
                  width: (column as any)?.minWidth ? `${(column as any).minWidth}px` : undefined,
                  minWidth: (column as any)?.minWidth ? `${(column as any).minWidth}px` : undefined,
                }}
              >
                <div 
                  style={{ 
                    lineHeight: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </td>
            )
          })}
        </tr>
      ))}
      {isFetchingNextPage && (
        <tr>
          <td colSpan={columns.length} className="h-16 text-center bg-white border-b border-gray-200">
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

// Footer component - Now integrated within the table structure
interface AdvancedTableFooterProps {
  footerData?: Record<string, any>
}

function AdvancedTableFooter({ footerData }: AdvancedTableFooterProps) {
  const { table, getStickyStyles, columns, enableBulkSelection, isSelectionMode } = useAdvancedTable()

  if (!footerData || Object.keys(footerData).length === 0) {
    return null
  }

  return (
    <tfoot className="sticky bottom-0 bg-gray-50 z-30 border-t border-gray-200">
      <tr style={{ height: "48px", minHeight: "48px", maxHeight: "48px" }}>
        {enableBulkSelection && isSelectionMode && (
          <td 
            className="font-medium px-4 bg-gray-50" 
            style={{ 
              width: 50,
              minWidth: 50,
              maxWidth: 50,
              height: "48px",
              minHeight: "48px",
              maxHeight: "48px",
              padding: "0 16px",
              lineHeight: "48px",
              verticalAlign: "middle",
              backgroundColor: "#f9fafb",
            }}
          >
            {/* Empty cell for checkbox column */}
          </td>
        )}
        {table.getHeaderGroups()?.[0]?.headers
          ?.filter((header) => header.column.id !== "select")
          .map((header) => {
            const stickyStyles = getStickyStyles(header.column.id, true)
            const column = columns.find((c: any) => c.id === header.column.id)
            const footerValue = footerData[header.column.id]

            // Determine alignment based on column type (numeric columns are right-aligned)
            const isNumericColumn = header.column.id === 'inbound' || 
                                  header.column.id === 'outbound' || 
                                  header.column.id === 'adjustment' || 
                                  header.column.id === 'onHand' || 
                                  header.column.id === 'available' || 
                                  header.column.id === 'onHold'

            return (
              <td
                key={header.id}
                className={cn(
                  "font-medium px-4 bg-gray-50 last:border-r-0",
                  stickyStyles.position && "z-50"
                )}
                style={{
                  ...stickyStyles,
                  backgroundColor: "#f9fafb",
                  height: "48px",
                  minHeight: "48px",
                  maxHeight: "48px",
                  padding: "0 16px",
                  lineHeight: "48px",
                  verticalAlign: "middle",
                  zIndex: stickyStyles.position ? 110 : 100,
                  width: (column as any)?.minWidth ? `${(column as any).minWidth}px` : undefined,
                  minWidth: (column as any)?.minWidth ? `${(column as any).minWidth}px` : undefined,
                }}
              >
                <div 
                  className={cn(isNumericColumn && "text-right")}
                  style={{ 
                    lineHeight: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isNumericColumn ? "flex-start" : "flex-start",
                  }}
                >
                  {footerValue !== undefined && footerValue !== null ? footerValue : ""}
                </div>
              </td>
            )
          })}
      </tr>
    </tfoot>
  )
}

// Bulk Actions component - positioned inside container at bottom
function AdvancedTableBulkActions() {
  const { enableBulkSelection, isSelectionMode, selectedRows, exitSelectionMode, handleBulkAction, toggleAllRows, data } = useAdvancedTable()

  if (!enableBulkSelection || !isSelectionMode || selectedRows.size === 0) {
    return null
  }

  const allSelected = selectedRows.size === data.length && data.length > 0

  return (
    <div className="absolute bottom-[6rem] left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center justify-between gap-3 bg-gray-800 rounded-lg p-3 shadow-lg min-w-[280px]">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={allSelected} 
            onCheckedChange={toggleAllRows}
            className="border-white text-blue-600 bg-white"
          />
          <span className="text-sm text-white font-medium">
            {selectedRows.size} of {data.length} Selected
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
            onClick={toggleAllRows}
            title={allSelected ? "Deselect all" : "Select all"}
          >
            <CheckSquare className="h-4 w-4" />
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
          
          <Button 
            size="sm" 
            className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1"
            onClick={() => handleBulkAction('add')}
            title="Add users"
          >
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
          
          <Button 
            size="sm" 
            onClick={exitSelectionMode} 
            className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 text-white"
            title="Exit selection mode"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Loading component - Now deprecated in favor of skeleton
function AdvancedTableLoading() {
  const { isLoading, data } = useAdvancedTable()

  if (!isLoading || data.length > 0) {
    return null
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Loading...</div>
    </div>
  )
}

// Export compound component
export const AdvancedTable = {
  Root: AdvancedTableRoot,
  Container: AdvancedTableContainer,
  Table: AdvancedTableTable,
  Header: AdvancedTableHeader,
  Body: AdvancedTableBody,
  Footer: AdvancedTableFooter,
  BulkActions: AdvancedTableBulkActions,
  Loading: AdvancedTableLoading,
}

// Export types
export type { BulkAction }