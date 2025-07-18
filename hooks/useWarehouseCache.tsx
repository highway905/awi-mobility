import { useState, useEffect } from 'react'
import { useGetWarehouseLocationDropdownListQuery } from '@/lib/redux/api/orderManagement'

interface Warehouse {
  id: string
  name: string
  displayName: string
  address1: string
  address2: string
  city: string
  stateId: string
  state: string
  zipCode: string
  country: string
  countryId: string
  phone: string
  fax: string
  email: string
  canvasHeight: number
  canvasWidth: number
  companyName: string
  countryCode: string
  stateCode: string
}

interface CachedWarehouseData {
  warehouses: Warehouse[]
  timestamp: number
  expiresAt: number
}

const CACHE_KEY = 'warehouse_dropdown_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function useWarehouseCache(enabled: boolean = true) {
  const [cachedWarehouses, setCachedWarehouses] = useState<Warehouse[]>([])
  const [isUsingCache, setIsUsingCache] = useState(false)

  // Check if we have valid cached data
  const getCachedData = (): CachedWarehouseData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const parsedCache: CachedWarehouseData = JSON.parse(cached)
      const now = Date.now()

      // Check if cache is still valid
      if (now < parsedCache.expiresAt) {
        return parsedCache
      } else {
        // Cache expired, remove it
        localStorage.removeItem(CACHE_KEY)
        return null
      }
    } catch (error) {
      console.error('Error reading warehouse cache:', error)
      localStorage.removeItem(CACHE_KEY)
      return null
    }
  }

  // Save data to cache
  const setCacheData = (warehouses: Warehouse[]) => {
    try {
      const now = Date.now()
      const cacheData: CachedWarehouseData = {
        warehouses,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error saving warehouse cache:', error)
    }
  }

  // Check for cached data on mount only if enabled
  useEffect(() => {
    if (enabled) {
      const cached = getCachedData()
      if (cached) {
        setCachedWarehouses(cached.warehouses)
        setIsUsingCache(true)
      }
    }
  }, [enabled])

  // Determine if we should skip the API call - now also depends on enabled flag
  const shouldSkipApiCall = !enabled || (isUsingCache && cachedWarehouses.length > 0)

  // Make API call only if enabled and we don't have valid cached data
  const {
    data: warehouseData,
    isFetching,
    error,
    isLoading,
  } = useGetWarehouseLocationDropdownListQuery(undefined, {
    skip: shouldSkipApiCall,
    refetchOnMountOrArgChange: false, // Don't refetch on mount if we have cache
    refetchOnFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on network reconnect
  })

  // Process and cache new API data - only when enabled
  useEffect(() => {
    if (enabled && warehouseData && !shouldSkipApiCall) {
      let processedWarehouses: Warehouse[] = []

      // Handle the expected response structure
      if (warehouseData.response && Array.isArray(warehouseData.response)) {
        processedWarehouses = warehouseData.response
      } else if (Array.isArray(warehouseData)) {
        processedWarehouses = warehouseData
      }

      if (processedWarehouses.length > 0) {
        setCachedWarehouses(processedWarehouses)
        setCacheData(processedWarehouses)
        setIsUsingCache(true)
      }
    }
  }, [enabled, warehouseData, shouldSkipApiCall])

  // Clear cache function (useful for manual refresh)
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    setCachedWarehouses([])
    setIsUsingCache(false)
  }

  // Refresh cache function
  const refreshCache = () => {
    clearCache()
    // This will trigger a new API call on next render
  }

  // Helper function to get warehouse by ID
  const getWarehouseById = (warehouseId: string) => {
    return cachedWarehouses.find(warehouse => warehouse.id === warehouseId)
  }

  return {
    warehouses: enabled ? cachedWarehouses : [],
    getWarehouseById,
    isLoading: enabled ? (isLoading && !isUsingCache) : false,
    isFetching: enabled ? (isFetching && !isUsingCache) : false,
    error: enabled ? (error && !isUsingCache ? error : null) : null,
    isUsingCache: enabled ? isUsingCache : false,
    clearCache,
    refreshCache,
    cacheAge: (() => {
      if (!enabled) return 0
      const cached = getCachedData()
      return cached ? Date.now() - cached.timestamp : 0
    })(),
  }
}
