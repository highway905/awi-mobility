"use client"

import { useState, useRef, useCallback, useMemo } from "react"

export interface VirtualScrollConfig {
  itemHeight: number
  containerHeight: number
  overscan?: number
  threshold?: number
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
