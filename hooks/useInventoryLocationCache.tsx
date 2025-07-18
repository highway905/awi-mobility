import { useState, useEffect } from 'react'
import { useGetAllInventoryLocationsDropDownListQuery } from '@/lib/redux/api/inventoryManagement'

interface InventoryLocation {
  id: string
  locationName: string
  locationTypeName: string
  locationTypeId: string
  warehouseName: string
  warehouseId: string
  recordStatus: string
  length: number
  width: number
  height: number
  maxWeight: number
  hasPallets: boolean
}

interface CachedInventoryLocationData {
  locations: InventoryLocation[]
  timestamp: number
  expiresAt: number
}

interface InventoryLocationQueryParams {
  searchKey?: string
  sortColumn?: string
  sortDirection?: string
  pageIndex?: number
  pageSize?: number
  warehouseId?: string
  locationTypeId?: string[]
}

const CACHE_KEY = 'inventory_location_dropdown_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function useInventoryLocationCache(queryParams?: InventoryLocationQueryParams, enabled: boolean = true) {
  const [cachedLocations, setCachedLocations] = useState<InventoryLocation[]>([])
  const [isUsingCache, setIsUsingCache] = useState(false)

  // Default query parameters
  const defaultParams: InventoryLocationQueryParams = {
    searchKey: "",
    sortColumn: "locationName",
    sortDirection: "asc",
    pageIndex: 0,
    pageSize: 1000, // Get all locations for dropdown
    warehouseId: "",
    locationTypeId: [],
    ...queryParams
  }

  // Generate cache key based on query parameters
  const getCacheKey = (params: InventoryLocationQueryParams) => {
    const keyParams = JSON.stringify(params)
    return `${CACHE_KEY}_${btoa(keyParams).replace(/[^a-zA-Z0-9]/g, '')}`
  }

  const currentCacheKey = getCacheKey(defaultParams)

  // Check if we have valid cached data
  const getCachedData = (): CachedInventoryLocationData | null => {
    try {
      const cached = localStorage.getItem(currentCacheKey)
      if (!cached) return null

      const parsedCache: CachedInventoryLocationData = JSON.parse(cached)
      const now = Date.now()

      // Check if cache is still valid
      if (now < parsedCache.expiresAt) {
        return parsedCache
      } else {
        // Cache expired, remove it
        localStorage.removeItem(currentCacheKey)
        return null
      }
    } catch (error) {
      console.error('Error reading inventory location cache:', error)
      localStorage.removeItem(currentCacheKey)
      return null
    }
  }

  // Save data to cache
  const setCacheData = (locations: InventoryLocation[]) => {
    try {
      const now = Date.now()
      const cacheData: CachedInventoryLocationData = {
        locations,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      }
      localStorage.setItem(currentCacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error saving inventory location cache:', error)
    }
  }

  // Check for cached data on mount only if enabled
  useEffect(() => {
    if (enabled) {
      const cached = getCachedData()
      if (cached) {
        setCachedLocations(cached.locations)
        setIsUsingCache(true)
      }
    }
  }, [currentCacheKey, enabled])

  // Determine if we should skip the API call - now also depends on enabled flag
  const shouldSkipApiCall = !enabled || (isUsingCache && cachedLocations.length > 0)

  // Make API call only if enabled and we don't have valid cached data
  const {
    data: locationData,
    isFetching,
    error,
    isLoading,
  } = useGetAllInventoryLocationsDropDownListQuery(defaultParams, {
    skip: shouldSkipApiCall,
    refetchOnMountOrArgChange: false, // Don't refetch on mount if we have cache
    refetchOnFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on network reconnect
  })

  // Process and cache new API data - only when enabled
  useEffect(() => {
    if (enabled && locationData && !shouldSkipApiCall) {
      let processedLocations: InventoryLocation[] = []

      // Handle the expected response structure
      if (locationData.response && locationData.response.items && Array.isArray(locationData.response.items)) {
        processedLocations = locationData.response.items
      } else if (locationData.items && Array.isArray(locationData.items)) {
        processedLocations = locationData.items
      } else if (Array.isArray(locationData)) {
        processedLocations = locationData
      }

      if (processedLocations.length > 0) {
        setCachedLocations(processedLocations)
        setCacheData(processedLocations)
        setIsUsingCache(true)
      }
    }
  }, [enabled, locationData, shouldSkipApiCall, currentCacheKey])

  // Clear cache function (useful for manual refresh)
  const clearCache = () => {
    localStorage.removeItem(currentCacheKey)
    setCachedLocations([])
    setIsUsingCache(false)
  }

  // Refresh cache function
  const refreshCache = () => {
    clearCache()
    // This will trigger a new API call on next render
  }

  // Helper functions to get filtered data
  const getLocationsByWarehouse = (warehouseId: string) => {
    return cachedLocations.filter(location => location.warehouseId === warehouseId)
  }

  const getUniqueWarehouses = () => {
    const warehouseMap = new Map()
    cachedLocations.forEach(location => {
      if (!warehouseMap.has(location.warehouseId)) {
        warehouseMap.set(location.warehouseId, {
          id: location.warehouseId,
          name: location.warehouseName
        })
      }
    })
    return Array.from(warehouseMap.values())
  }

  return {
    locations: enabled ? cachedLocations : [],
    warehouses: enabled ? getUniqueWarehouses() : [],
    getLocationsByWarehouse,
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
