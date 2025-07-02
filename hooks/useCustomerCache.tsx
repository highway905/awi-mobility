import { useState, useEffect } from 'react'
import { useGetCustomerDropdownListQuery } from '@/lib/redux/api/orderManagement'

interface Customer {
  id: string
  customerName: string
}

interface CachedCustomerData {
  customers: Customer[]
  timestamp: number
  expiresAt: number
}

const CACHE_KEY = 'customer_dropdown_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function useCustomerCache() {
  const [cachedCustomers, setCachedCustomers] = useState<Customer[]>([])
  const [isUsingCache, setIsUsingCache] = useState(false)

  // Check if we have valid cached data
  const getCachedData = (): CachedCustomerData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const parsedCache: CachedCustomerData = JSON.parse(cached)
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
      console.error('Error reading customer cache:', error)
      localStorage.removeItem(CACHE_KEY)
      return null
    }
  }

  // Save data to cache
  const setCacheData = (customers: Customer[]) => {
    try {
      const now = Date.now()
      const cacheData: CachedCustomerData = {
        customers,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error saving customer cache:', error)
    }
  }

  // Check for cached data on mount
  useEffect(() => {
    const cached = getCachedData()
    if (cached) {
      setCachedCustomers(cached.customers)
      setIsUsingCache(true)
    }
  }, [])

  // Determine if we should skip the API call
  const shouldSkipApiCall = isUsingCache && cachedCustomers.length > 0

  // Make API call only if we don't have valid cached data
  const {
    data: customerData,
    isFetching,
    error,
    isLoading,
  } = useGetCustomerDropdownListQuery(undefined, {
    skip: shouldSkipApiCall,
    refetchOnMountOrArgChange: false, // Don't refetch on mount if we have cache
  })

  // Process and cache new API data
  useEffect(() => {
    if (customerData && !shouldSkipApiCall) {
      let processedCustomers: Customer[] = []

      // Handle different possible response structures
      if (customerData.response && Array.isArray(customerData.response)) {
        processedCustomers = customerData.response
      } else if (Array.isArray(customerData)) {
        processedCustomers = customerData
      } else if (customerData.items && Array.isArray(customerData.items)) {
        processedCustomers = customerData.items
      }

      if (processedCustomers.length > 0) {
        setCachedCustomers(processedCustomers)
        setCacheData(processedCustomers)
        setIsUsingCache(true)
      }
    }
  }, [customerData, shouldSkipApiCall])

  // Clear cache function (useful for manual refresh)
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    setCachedCustomers([])
    setIsUsingCache(false)
  }

  // Refresh cache function
  const refreshCache = () => {
    clearCache()
    // This will trigger a new API call on next render
  }

  return {
    customers: cachedCustomers,
    isLoading: isLoading && !isUsingCache,
    isFetching: isFetching && !isUsingCache,
    error: error && !isUsingCache ? error : null,
    isUsingCache,
    clearCache,
    refreshCache,
    cacheAge: (() => {
      const cached = getCachedData()
      return cached ? Date.now() - cached.timestamp : 0
    })(),
  }
}