"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"

export interface VirtualScrollConfig {
  itemHeight: number
  containerHeight: number
  overscan: number
  threshold: number
}

export interface VirtualScrollState {
  startIndex: number
  endIndex: number
  scrollTop: number
  visibleItems: any[]
  totalHeight: number
}

export function useVirtualScroll<T>(
  items: T[],
  config: VirtualScrollConfig
) {
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    threshold = 1000
  } = config

  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  // Should we use virtual scrolling?
  const shouldVirtualize = items.length > threshold

  // Calculate visible range
  const { startIndex, endIndex, visibleItems, totalHeight } = useMemo(() => {
    if (!shouldVirtualize) {
      return {
        startIndex: 0,
        endIndex: items.length - 1,
        visibleItems: items,
        totalHeight: items.length * itemHeight
      }
    }

    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      startIndex + visibleCount + overscan * 2
    )

    const visibleItems = items.slice(startIndex, endIndex + 1)
    const totalHeight = items.length * itemHeight

    return {
      startIndex,
      endIndex,
      visibleItems,
      totalHeight
    }
  }, [items, scrollTop, itemHeight, containerHeight, overscan, shouldVirtualize])

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    setScrollTop(scrollTop)
  }, [])

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    if (scrollElementRef.current) {
      const targetScrollTop = index * itemHeight
      scrollElementRef.current.scrollTop = targetScrollTop
      setScrollTop(targetScrollTop)
    }
  }, [itemHeight])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollToIndex(0)
  }, [scrollToIndex])

  // Get item styles for absolute positioning
  const getItemStyle = useCallback((index: number) => {
    if (!shouldVirtualize) {
      return {}
    }

    return {
      position: 'absolute' as const,
      top: (startIndex + index) * itemHeight,
      left: 0,
      right: 0,
      height: itemHeight,
    }
  }, [startIndex, itemHeight, shouldVirtualize])

  // Get container styles
  const getContainerStyle = useCallback(() => {
    if (!shouldVirtualize) {
      return {
        height: containerHeight,
        overflow: 'auto' as const,
      }
    }

    return {
      height: containerHeight,
      overflow: 'auto' as const,
      position: 'relative' as const,
    }
  }, [containerHeight, shouldVirtualize])

  // Get inner styles (for total height)
  const getInnerStyle = useCallback(() => {
    if (!shouldVirtualize) {
      return {}
    }

    return {
      height: totalHeight,
      position: 'relative' as const,
    }
  }, [totalHeight, shouldVirtualize])

  return {
    // State
    scrollTop,
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    shouldVirtualize,
    
    // Refs
    scrollElementRef,
    
    // Handlers
    handleScroll,
    scrollToIndex,
    scrollToTop,
    
    // Styles
    getItemStyle,
    getContainerStyle,
    getInnerStyle,
  }
}

// Virtual Table Row Component
export interface VirtualTableRowProps {
  item: any
  index: number
  columns: any[]
  onRowClick?: (item: any) => void
  style?: React.CSSProperties
}

export function VirtualTableRow({
  item,
  index,
  columns,
  onRowClick,
  style
}: VirtualTableRowProps) {
  return (
    <div
      style={style}
      className="flex items-center border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
      onClick={() => onRowClick?.(item)}
    >
      {columns.map((column, colIndex) => (
        <div
          key={column.key || colIndex}
          className="flex-shrink-0 px-4 py-3 text-sm"
          style={{ width: column.width || 120, minWidth: column.minWidth || 80 }}
        >
          {column.render ? column.render(item[column.key], item) : item[column.key]}
        </div>
      ))}
    </div>
  )
}

// Virtual Table Component
export interface VirtualTableProps<T> {
  data: T[]
  columns: any[]
  height: number
  rowHeight?: number
  onRowClick?: (item: T) => void
  overscan?: number
  threshold?: number
  emptyMessage?: string
  isLoading?: boolean
}

export function VirtualTable<T>({
  data,
  columns,
  height,
  rowHeight = 60,
  onRowClick,
  overscan = 5,
  threshold = 1000,
  emptyMessage = "No data available",
  isLoading = false
}: VirtualTableProps<T>) {
  const {
    visibleItems,
    shouldVirtualize,
    scrollElementRef,
    handleScroll,
    getItemStyle,
    getContainerStyle,
    getInnerStyle,
    scrollToTop
  } = useVirtualScroll(data, {
    itemHeight: rowHeight,
    containerHeight: height,
    overscan,
    threshold,
  })

  // Header click to scroll to top
  const handleHeaderClick = useCallback(() => {
    scrollToTop()
  }, [scrollToTop])

  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center border rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center border rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10 cursor-pointer"
        onClick={handleHeaderClick}
        title="Click to scroll to top"
      >
        {columns.map((column, index) => (
          <div
            key={column.key || index}
            className="flex-shrink-0 px-4 py-3 text-sm font-medium text-gray-700"
            style={{ width: column.width || 120, minWidth: column.minWidth || 80 }}
          >
            {column.header || column.key}
          </div>
        ))}
      </div>

      {/* Body */}
      {shouldVirtualize ? (
        <div
          ref={scrollElementRef}
          style={getContainerStyle()}
          onScroll={handleScroll}
          className="relative"
        >
          <div style={getInnerStyle()}>
            {visibleItems.map((item, index) => (
              <VirtualTableRow
                key={index}
                item={item}
                index={index}
                columns={columns}
                onRowClick={onRowClick}
                style={getItemStyle(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ height: height - 60, overflow: 'auto' }}>
          {data.map((item, index) => (
            <VirtualTableRow
              key={index}
              item={item}
              index={index}
              columns={columns}
              onRowClick={onRowClick}
            />
          ))}
        </div>
      )}

      {/* Footer info */}
      {shouldVirtualize && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          Virtual scrolling enabled • {data.length.toLocaleString()} total items
        </div>
      )}
    </div>
  )
}
