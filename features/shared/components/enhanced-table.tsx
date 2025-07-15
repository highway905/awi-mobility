"use client"

import React, { useMemo, useEffect, useRef, useCallback, useState } from "react"
import type { Table, Row, Column, HeaderContext } from "@tanstack/react-table"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, ChevronsUpDown, X, Edit } from "lucide-react"

export type EnhancedTableColumn<T> = ColumnDef<T, any> & {
  sticky?: "left" | "right"
  minWidth?: number
}

interface EnhancedTableProps<T> {
  /**
   * Controls whether clicking a row should redirect
   * When true, clicking a row calls onRowClick
   * When false, clicking a row only toggles selection in selection mode
   */
  redirectEnabled?: boolean
  data: T[]
  columns: EnhancedTableColumn<T>[]
  className?: string
  /**
   * Callback function called when a row is clicked.
   * Use this for navigation to a new page based on the row data.
   */
  onRowClick?: (row: T) => void
  // Infinite scroll props
  hasNextPage?: boolean
  fetchNextPage?: () => void | Promise<void>
  isFetchingNextPage?: boolean
  // Sticky columns configuration
  stickyColumns?: {
    left?: string[] // column ids
    right?: string[] // column ids
  }
  // Footer data for totals
  footerData?: Record<string, any>
  // Loading state
  isLoading?: boolean
  // Empty state
  emptyMessage?: string
  // Bulk selection props
  enableBulkSelection?: boolean
  onBulkAction?: (action: string, selectedRows: T[]) => void
  bulkActions?: Array<{
    id: string
    label: string
    icon?: React.ReactNode
    variant?: "default" | "destructive"
  }>
}

export function EnhancedTable<T>({
  data = [],
  columns,
  className,
  onRowClick,
  redirectEnabled = true, // Default to true for backward compatibility
  hasNextPage = false,
  fetchNextPage,
  isFetchingNextPage = false,
  stickyColumns,
  footerData,
  isLoading = false,
  emptyMessage = "No data available",
  enableBulkSelection = false,
  onBulkAction,
  bulkActions = [{ id: "", label: "Edit", icon: <Edit className="h-4 w-4" /> }],
}: EnhancedTableProps<T>) {
  console.log("EnhancedTable :",data)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  // Bulk selection state - only used when enableBulkSelection is true
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [pressStartTime, setPressStartTime] = useState<number>(0)

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const safeData = Array.isArray(data) ? data : []
  const safeColumns = Array.isArray(columns) ? columns : []

  // Handle press start - only if bulk selection is enabled
  const handlePressStart = useCallback(
    (rowIndex: number, event: React.MouseEvent | React.TouchEvent) => {
      if (!enableBulkSelection || isSelectionMode) return

      const currentTime = Date.now()
      setPressStartTime(currentTime)
      setIsLongPressing(false)

      // Clear any existing timer
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }

      const timer = setTimeout(() => {
        setIsLongPressing(true)
        setIsSelectionMode(true)
        setSelectedRows(new Set([rowIndex]))
      }, 800) // Reduced to 800ms for better responsiveness

      setLongPressTimer(timer)
    },
    [enableBulkSelection, isSelectionMode, longPressTimer],
  )

  // Handle press end
  const handlePressEnd = useCallback(() => {
    if (!enableBulkSelection) return

    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Reset states after a brief delay to prevent immediate re-trigger
    setTimeout(() => {
      setIsLongPressing(false)
      setPressStartTime(0)
    }, 100)
  }, [enableBulkSelection, longPressTimer])

  // Handle press cancel (mouse leave, touch cancel)
  const handlePressCancel = useCallback(() => {
    if (!enableBulkSelection) return

    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    setIsLongPressing(false)
    setPressStartTime(0)
  }, [enableBulkSelection, longPressTimer])

  // Exit selection mode
  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false)
    setSelectedRows(new Set())
  }, [])

  // Toggle row selection
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

  // Toggle all rows selection
  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === safeData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(safeData.map((_, index) => index)))
    }
  }, [selectedRows.size, safeData.length])

  // Handle bulk action
  const handleBulkAction = useCallback(
    (actionId: string) => {
      const selectedData = Array.from(selectedRows).map((index) => safeData[index])
      onBulkAction?.(actionId, selectedData)
      exitSelectionMode()
    },
    [selectedRows, safeData, onBulkAction, exitSelectionMode],
  )

  // Checkbox column definition - only when bulk selection is enabled
  const checkboxColumn = useMemo(
    () => ({
      id: "select",
      header: ({ table }: { table: Table<T> }) => (
        <div className="flex items-center justify-between">
          <Checkbox
            checked={selectedRows.size === safeData.length && safeData.length > 0}
            onCheckedChange={toggleAllRows}
            className=""
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }: { row: Row<T> }) => (
        <Checkbox
          checked={selectedRows.has(row.index)}
          onCheckedChange={() => toggleRowSelection(row.index)}
          aria-label={`Select row ${row.index}`}
          className=""
        />
      ),
      enableSorting: false,
      enableHiding: false,
      minWidth: 40,
      sticky: "left",
    }),
    [selectedRows, safeData.length, toggleAllRows, toggleRowSelection],
  )

  // Enhanced columns with optional checkbox column
  const enhancedColumns = useMemo(() => {
    const baseColumns = safeColumns.map((column) => ({
      ...column,
      header: ({ column: col }: { column: Column<T> }) => {
        const isSticky = stickyColumns?.left?.includes(col.id) || stickyColumns?.right?.includes(col.id)

        return (
          <div className={cn("flex items-center gap-1 font-medium text-gray-600", isSticky && "bg-white")}>
            {typeof column.header === "string"
              ? column.header
              : typeof column.header === "function"
                ? column.header({ column: col } as any)
                : column.header}
            {col.getCanSort() && (
              <button onClick={col.getToggleSortingHandler()} className="ml-1 hover:bg-gray-100 rounded p-1">
                {col.getIsSorted() === "asc" ? (
                  <ChevronUp className="h-3 w-3" />
                ) : col.getIsSorted() === "desc" ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronsUpDown className="h-3 w-3" />
                )}
              </button>
            )}
          </div>
        )
      },
    }))

    return enableBulkSelection && isSelectionMode ? [checkboxColumn, ...baseColumns] : baseColumns
  }, [safeColumns, stickyColumns, enableBulkSelection, isSelectionMode, checkboxColumn])

  const table = useReactTable({
    data: safeData,
    columns: enhancedColumns as ColumnDef<T, any>[],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Only use pagination model if we're not doing infinite scroll
    ...(hasNextPage ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      // Set a large page size when all data is loaded to ensure all rows are displayed
      pagination: {
        pageIndex: 0,
        pageSize: safeData.length > 0 ? safeData.length : 100,
      },
    },
    // Always use manual pagination for infinite scroll
    manualPagination: true,
  })

  // Improved infinite scroll with scroll-based detection
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
        // Trigger when user scrolls to within 100px of the bottom
        if (scrollHeight - scrollTop - clientHeight < 100) {
          fetchNextPage()
        }
      })
    }

    container.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  // Get sticky column styles
  const getStickyStyles = useCallback(
    (columnId: string) => {
      if (!stickyColumns) return {}

      const leftColumns =
        enableBulkSelection && isSelectionMode ? ["select", ...(stickyColumns.left || [])] : stickyColumns.left || []

      if (leftColumns.includes(columnId)) {
        const index = leftColumns.indexOf(columnId)
        const leftOffset = leftColumns.slice(0, index).reduce((acc, id) => {
          if (id === "select") return acc + 80
          const col = safeColumns.find((c) => c.id === id)
          return acc + (col?.minWidth || 120)
        }, 0)

        return {
          position: "sticky" as const,
          left: leftOffset,
          zIndex: 20,
          backgroundColor: "white",
          borderRight: "1px solid #e5e7eb",
        }
      }

      if (stickyColumns.right?.includes(columnId)) {
        const index = stickyColumns.right.indexOf(columnId)
        const rightOffset = stickyColumns.right.slice(index + 1).reduce((acc, id) => {
          const col = safeColumns.find((c) => c.id === id)
          return acc + (col?.minWidth || 120)
        }, 0)

        return {
          position: "sticky" as const,
          right: rightOffset,
          zIndex: 20,
          backgroundColor: "white",
          borderLeft: "1px solid #e5e7eb",
        }
      }

      return {}
    },
    [stickyColumns, safeColumns, enableBulkSelection, isSelectionMode],
  )

  /**
   * Handles row click events with proper timing coordination.
   * If in selection mode, toggles the row selection.
   * Otherwise, calls the onRowClick callback for navigation.
   */
  const handleRowClick = useCallback(
    (row: T, rowIndex: number, event: React.MouseEvent) => {
      // Case 1: If we're in the middle of a long press, prevent any click action
      if (isLongPressing) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      // Case 2: If we're in selection mode, toggle the row selection
      if (isSelectionMode) {
        toggleRowSelection(rowIndex)
        return
      }

      // Case 3: If bulk selection is enabled and this was a potential long press that didn't complete
      if (enableBulkSelection && pressStartTime > 0 && Date.now() - pressStartTime < 900) {
        return
      }

      // Case 4: Regular click - redirect only if redirectEnabled is true
      if (redirectEnabled && onRowClick) {
        onRowClick(row)
      }
    },
    [
      enableBulkSelection,
      isLongPressing,
      isSelectionMode,
      toggleRowSelection,
      pressStartTime,
      onRowClick,
      redirectEnabled,
    ],
  )

  if (isLoading && safeData.length === 0) {
    return (
      <div className={cn("flex-1 rounded-dashboard border border-dashboard-border bg-white", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex-1 rounded-dashboard border border-dashboard-border bg-white overflow-hidden relative",
        className,
      )}
    >
      <div
        ref={tableContainerRef}
        className="h-full overflow-auto relative"
        style={{
          WebkitUserSelect: enableBulkSelection && pressStartTime > 0 ? "none" : "auto",
          userSelect: enableBulkSelection && pressStartTime > 0 ? "none" : "auto",
          height: "calc(100vh - 126px)", // Ensure proper height for scrolling
        }}
      >
        <table className="relative w-full border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-white z-30 shadow-sm">
            {(table.getHeaderGroups() || []).map((headerGroup) => (
              <tr key={headerGroup.id} className="h-10 border-b border-dashboard-border">
                {headerGroup.headers.map((header) => {
                  const stickyStyles = getStickyStyles(header.column.id)
                  const column = enhancedColumns.find((c) => c.id === header.column.id)

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "h-10 px-4 text-left align-middle text-sm font-medium text-gray-600 bg-white",
                        stickyStyles.position && "z-20",
                      )}
                      style={{
                        ...stickyStyles,
                        minWidth: column?.minWidth || 120,
                        position: "sticky",
                        top: 0,
                        zIndex: stickyStyles.position ? 40 : 30,
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody>
            {(table.getRowModel().rows || []).length ? (
              <>
                {(table.getRowModel().rows || []).map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "h-12 border-b border-dashboard-border text-sm hover:bg-gray-50/50 transition-colors",
                      enableBulkSelection ? "select-none" : "",
                      onRowClick || (enableBulkSelection && isSelectionMode) ? "cursor-pointer" : "",
                      enableBulkSelection && selectedRows.has(row.index) && "bg-blue-50",
                    )}
                    onClick={(e) => handleRowClick(row.original, row.index, e)}
                    onMouseDown={
                      enableBulkSelection
                        ? (e) => {
                            handlePressStart(row.index, e)
                          }
                        : undefined
                    }
                    onMouseUp={enableBulkSelection ? handlePressEnd : undefined}
                    onMouseLeave={enableBulkSelection ? handlePressCancel : undefined}
                    onTouchStart={
                      enableBulkSelection
                        ? (e) => {
                            handlePressStart(row.index, e)
                          }
                        : undefined
                    }
                    onTouchEnd={enableBulkSelection ? handlePressEnd : undefined}
                    onTouchCancel={enableBulkSelection ? handlePressCancel : undefined}
                    onContextMenu={enableBulkSelection ? (e) => e.preventDefault() : undefined}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const stickyStyles = getStickyStyles(cell.column.id)
                      const column = enhancedColumns.find((c) => c.id === cell.column.id)

                      return (
                        <td
                          key={cell.id}
                          className={cn("h-12 px-4 align-middle", stickyStyles.position && "z-10")}
                          style={{
                            ...stickyStyles,
                            minWidth: column?.minWidth || 120,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={enhancedColumns.length} className="h-24 text-center">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>

          {/* Footer with totals */}
          {footerData && Object.keys(footerData).length > 0 && (
            <tfoot className="sticky bottom-0 bg-gray-50 z-10">
              <tr>
                {enableBulkSelection && isSelectionMode && (
                  <td className="font-medium sticky left-0 bg-gray-50 z-20 border-r" style={{ minWidth: 80 }}>
                    {/* Empty cell for checkbox column */}
                  </td>
                )}
                {(table.getHeaderGroups()?.[0]?.headers || [])
                  .filter((header) => header.column.id !== "select")
                  .map((header) => {
                    const stickyStyles = getStickyStyles(header.column.id)
                    const column = safeColumns.find((c) => c.id === header.column.id)
                    const footerValue = footerData[header.column.id]

                    return (
                      <td
                        key={header.id}
                        className={cn("font-medium", stickyStyles.position && "z-20")}
                        style={{
                          ...stickyStyles,
                          backgroundColor: "#f9fafb",
                          minWidth: column?.minWidth || 120,
                        }}
                      >
                        {footerValue !== undefined && footerValue !== null ? footerValue : ""}
                      </td>
                    )
                  })}
              </tr>
            </tfoot>
          )}
        </table>

        {/* Loading indicator - shows at bottom when loading */}
        {isFetchingNextPage && (
          <div className="h-16 flex items-center justify-center bg-white border-t border-dashboard-border">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              Loading more...
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Menu - only show if bulk selection is enabled */}
      {enableBulkSelection && isSelectionMode && selectedRows.size > 0 && (
        <div className="w-[350px] h-[56px] absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 bg-[#78716C] rounded-lg p-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox className="border-white" />
                <span className="text-sm text-white px-2">{selectedRows.size} Selected</span>
              </div>
              <div className="" />
              <Button size="sm" onClick={() => {}} className="h-[10] w-[10] p-3 bg-[#FBBF24]">
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.00008 3.66665C4.00008 2.56208 4.89551 1.66665 6.00008 1.66665C7.10465 1.66665 8.00008 2.56208 8.00008 3.66665C8.00008 4.77122 7.10465 5.66665 6.00008 5.66665C4.89551 5.66665 4.00008 4.77122 4.00008 3.66665ZM6.00008 0.333313C4.15913 0.333313 2.66675 1.8257 2.66675 3.66665C2.66675 5.5076 4.15913 6.99998 6.00008 6.99998C7.84103 6.99998 9.33341 5.5076 9.33341 3.66665C9.33341 1.8257 7.84103 0.333313 6.00008 0.333313ZM4.00008 8.33331C3.11603 8.33331 2.26818 8.6845 1.64306 9.30962C1.01794 9.93475 0.666748 10.7826 0.666748 11.6666V13C0.666748 13.3682 0.965225 13.6666 1.33341 13.6666C1.7016 13.6666 2.00008 13.3682 2.00008 13V11.6666C2.00008 11.1362 2.2108 10.6275 2.58587 10.2524C2.96094 9.87736 3.46965 9.66665 4.00008 9.66665H8.00008C8.53051 9.66665 9.03922 9.87736 9.4143 10.2524C9.78937 10.6275 10.0001 11.1362 10.0001 11.6666V13C10.0001 13.3682 10.2986 13.6666 10.6667 13.6666C11.0349 13.6666 11.3334 13.3682 11.3334 13V11.6666C11.3334 10.7826 10.9822 9.93475 10.3571 9.30962C9.73198 8.6845 8.88414 8.33331 8.00008 8.33331H4.00008ZM12.6667 3.66665C13.0349 3.66665 13.3334 3.96512 13.3334 4.33331V5.66665H14.6667C15.0349 5.66665 15.3334 5.96512 15.3334 6.33331C15.3334 6.7015 15.0349 6.99998 14.6667 6.99998H13.3334V8.33331C13.3334 8.7015 13.0349 8.99998 12.6667 8.99998C12.2986 8.99998 12.0001 8.7015 12.0001 8.33331V6.99998H10.6667C10.2986 6.99998 10.0001 6.7015 10.0001 6.33331C10.0001 5.96512 10.2986 5.66665 10.6667 5.66665H12.0001V4.33331C12.0001 3.96512 12.2986 3.66665 12.6667 3.66665Z"
                    fill="#1C1917"
                  />
                </svg>
              </Button>
            </div>
            <Button size="sm" onClick={exitSelectionMode} className="h-[10] w-[10] p-3 bg-[#FBBF24]">
              <X className="h-4 w-4 text-black" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}