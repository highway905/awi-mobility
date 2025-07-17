/**
 * Custom Hooks for Order Management
 * Reusable hooks for common patterns like localStorage, API states, etc.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { 
  OrderFilter, 
  OrderTab, 
  DateRange, 
  Order,
  LoadingStates,
  ErrorStates 
} from '../types/order.types'
import {
  getDefaultOrderFilter,
  getDefaultDateRange,
  setLocalStorageItem,
  getLocalStorageItem,
  transformFilterToApiPayload,
  transformApiResponseToOrder,
  debounce,
} from '../utils/order.utils'

// ============================================================================
// localStorage Hooks (SSR-safe)
// ============================================================================

/**
 * SSR-safe localStorage hook with proper hydration
 * @param key - localStorage key
 * @param initialValue - default value
 * @returns [value, setValue, isHydrated]
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [isHydrated, setIsHydrated] = useState(false)
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key)
        if (item) {
          const parsed = JSON.parse(item)
          setStoredValue(parsed)
        }
      }
    } catch (error) {
      // Error reading localStorage
    } finally {
      setIsHydrated(true)
    }
  }, [key])

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prevValue => {
        const valueToStore = value instanceof Function ? value(prevValue) : value
        
        // Save to localStorage if available
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(valueToStore))
        }
        
        return valueToStore
      })
    } catch (error) {
      // Error setting localStorage
    }
  }, [key])

  return [storedValue, setValue, isHydrated]
}

/**
 * Hook for persisting order filter state
 */
export function useOrderFilterStorage(searchQuery: string = '') {
  const { fromISO, toISO } = getDefaultDateRange()
  
  const defaultFilter: OrderFilter = useMemo(() => ({
    ...getDefaultOrderFilter(),
    searchKey: searchQuery,
    fromDate: fromISO,
    toDate: toISO,
    sortColumn: 'transactionId',
    sortDirection: 'asc' as 'asc',
  }), [searchQuery, fromISO, toISO])

  const [filter, setFilter, isHydrated] = useLocalStorage<OrderFilter>(
    'orderListFilter',
    defaultFilter
  )

  // Update search key when it changes
  useEffect(() => {
    if (isHydrated && filter.searchKey !== searchQuery) {
      setFilter(prev => ({
        ...prev,
        searchKey: searchQuery,
      }))
    }
  }, [searchQuery, filter.searchKey, setFilter, isHydrated])

  return { filter, setFilter, isHydrated }
}

/**
 * Hook for persisting current tab state
 */
export function useOrderTabStorage() {
  const [currentTab, setCurrentTab, isHydrated] = useLocalStorage<OrderTab>(
    'orderCurrentTab',
    'all'
  )

  return { currentTab, setCurrentTab, isHydrated }
}

// ============================================================================
// Filter Management Hooks
// ============================================================================

/**
 * Hook for managing order filters with debouncing and API integration
 */
export function useOrderFilters(
  initialFilter: OrderFilter,
  onFilterChange: (filter: Partial<OrderFilter>) => void
) {
  const [filter, setFilter] = useState<OrderFilter>(initialFilter)
  const [dateRange, setDateRange] = useState<DateRange>(() => ({
    from: filter.fromDate ? new Date(filter.fromDate) : undefined,
    to: filter.toDate ? new Date(filter.toDate) : undefined,
  }))
  const [searchQuery, setSearchQuery] = useState(filter.searchKey || '')

  // Debounced search handler
  const debouncedSearchUpdate = useCallback(
    debounce((query: string) => {
      setFilter(prev => ({ ...prev, searchKey: query, pageIndex: 1 }))
      onFilterChange({ searchKey: query, pageIndex: 1 })
    }, 300),
    [onFilterChange]
  )

  // Handle search changes
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    debouncedSearchUpdate(query)
  }, [debouncedSearchUpdate])

  // Handle date range changes
  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range)
    
    if (range.from && range.to) {
      const fromDate = new Date(range.from)
      fromDate.setHours(0, 0, 0, 0)
      
      const toDate = new Date(range.to)
      toDate.setHours(23, 59, 59, 999)
      
      const updates = {
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        pageIndex: 1,
      }
      
      setFilter(prev => ({ ...prev, ...updates }))
      onFilterChange(updates)
    }
  }, [onFilterChange])

  // Handle tab changes
  const handleTabChange = useCallback((tab: OrderTab) => {
    const updates = { pageIndex: 1 }
    setFilter(prev => ({ ...prev, ...updates }))
    onFilterChange(updates)
  }, [onFilterChange])

  // Handle general filter updates
  const handleFilterUpdate = useCallback((updates: Partial<OrderFilter>) => {
    setFilter(prev => ({ ...prev, ...updates }))
    onFilterChange(updates)
  }, [onFilterChange])

  return {
    filter,
    dateRange,
    searchQuery,
    handleSearchChange,
    handleDateRangeChange,
    handleTabChange,
    handleFilterUpdate,
  }
}

// ============================================================================
// API State Management Hooks
// ============================================================================

/**
 * Hook for managing loading states
 */
export function useLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    initial: false,
    loadingMore: false,
    refreshing: false,
    saving: false,
  })

  const updateLoadingState = useCallback((key: keyof LoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }))
  }, [])

  return { loadingStates, updateLoadingState }
}

/**
 * Hook for managing error states
 */
export function useErrorStates() {
  const [errorStates, setErrorStates] = useState<ErrorStates>({
    loadError: null,
    saveError: null,
    networkError: null,
  })

  const setError = useCallback((key: keyof ErrorStates, error: string | null) => {
    setErrorStates(prev => ({ ...prev, [key]: error }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrorStates({
      loadError: null,
      saveError: null,
      networkError: null,
    })
  }, [])

  return { errorStates, setError, clearErrors }
}

/**
 * Hook for managing orders data with pagination
 */
export function useOrdersData() {
  const [orders, setOrders] = useState<Order[]>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const updateOrders = useCallback((
    newOrders: Order[], 
    isFirstPage: boolean, 
    total: number
  ) => {
    if (isFirstPage) {
      setOrders(newOrders)
    } else {
      setOrders(prev => [...prev, ...newOrders])
    }
    setTotalCount(total)
  }, [])

  const updatePagination = useCallback((
    currentPage: number, 
    pageSize: number, 
    total: number
  ) => {
    const hasMore = (currentPage * pageSize) < total
    setHasNextPage(hasMore)
  }, [])

  return {
    orders,
    hasNextPage,
    totalCount,
    updateOrders,
    updatePagination,
    setOrders,
  }
}

// ============================================================================
// Navigation Hooks
// ============================================================================

/**
 * Hook for handling order navigation
 */
export function useOrderNavigation() {
  const router = useRouter()

  const navigateToOrder = useCallback((orderId: string) => {
    router.push(`/order-details/${orderId}`)
  }, [router])

  const navigateToOrders = useCallback((searchQuery?: string) => {
    const url = searchQuery ? `/orders?search=${encodeURIComponent(searchQuery)}` : '/orders'
    router.push(url)
  }, [router])

  return { navigateToOrder, navigateToOrders }
}

// ============================================================================
// Sorting Hooks
// ============================================================================

/**
 * Hook for managing table sorting
 */
export function useOrderSorting(
  onSortChange: (column: string | null, direction: 'asc' | 'desc' | null) => void
) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  const handleSort = useCallback((column: string | null, direction: 'asc' | 'desc' | null) => {
    setSortColumn(column)
    setSortDirection(direction)
    onSortChange(column, direction)
  }, [onSortChange])

  const resetSort = useCallback(() => {
    setSortColumn(null)
    setSortDirection(null)
    onSortChange(null, null)
  }, [onSortChange])

  return {
    sortColumn,
    sortDirection,
    handleSort,
    resetSort,
  }
}

// ============================================================================
// Bulk Actions Hooks
// ============================================================================

/**
 * Hook for managing bulk actions
 */
export function useBulkActions<T>() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const toggleItem = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback((items: T[], getId: (item: T) => string) => {
    const allIds = new Set(items.map(getId))
    setSelectedItems(allIds)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set())
    setIsSelectionMode(false)
  }, [])

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => !prev)
    if (isSelectionMode) {
      clearSelection()
    }
  }, [isSelectionMode, clearSelection])

  return {
    selectedItems,
    isSelectionMode,
    toggleItem,
    selectAll,
    clearSelection,
    toggleSelectionMode,
  }
}

// ============================================================================
// API Integration Hooks
// ============================================================================

/**
 * Hook for processing order API responses
 */
export function useOrderApiProcessor() {
  const processOrderResponse = useCallback((
    response: any,
    currentPage: number
  ): { orders: Order[]; totalCount: number; isFirstPage: boolean } => {
    try {
      // Handle different response structures after Redux transform
      let items: any[] = [];
      let totalCount = 0;

      if (Array.isArray(response)) {
        // Most likely case: API returns array of orders directly
        items = response;
        totalCount = response.length;
      } else if (response && typeof response === 'object') {
        // Check for paginated response structure
        if (response.items && Array.isArray(response.items)) {
          items = response.items;
          totalCount = response.totalCount || response.total || items.length;
        } else if (response.data && Array.isArray(response.data)) {
          items = response.data;
          totalCount = response.totalCount || response.total || items.length;
        } else {
          // Fallback: treat as single order
          items = [response];
          totalCount = 1;
        }
      } else {
        // No valid data found
        return { orders: [], totalCount: 0, isFirstPage: true };
      }
      
      if (!Array.isArray(items) || items.length === 0) {
        return { orders: [], totalCount: 0, isFirstPage: currentPage === 1 }
      }

      // Transform each item to our Order interface
      const orders = items.map((item: any) => transformApiResponseToOrder(item))
      const isFirstPage = currentPage === 1

      return { orders, totalCount, isFirstPage }
    } catch (error) {
      console.error('❌ Error processing order response:', error);
      return { orders: [], totalCount: 0, isFirstPage: true }
    }
  }, [])

  return { processOrderResponse }
}

// ============================================================================
// Performance Hooks
// ============================================================================

/**
 * Hook for creating stable API payload
 */
export function useStableApiPayload(filter: OrderFilter, tab: OrderTab) {
  return useMemo(() => {
    return transformFilterToApiPayload(filter, tab)
  }, [filter, tab])
}

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// ============================================================================
// Window/Browser Hooks
// ============================================================================

/**
 * Hook to detect if we're in the browser (SSR-safe)
 */
export function useIsBrowser() {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined')
  }, [])

  return isBrowser
}

/**
 * Hook for window size detection
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
