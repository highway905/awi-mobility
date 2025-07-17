"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useGetInventoryItemsListQuery } from "@/lib/redux/api/inventoryManagement"

export interface InventoryItem {
  id: string
  sku: string
  warehouse: string
  location: string
  palletId: string
  inbound: number
  outbound: number
  adjustment: number
  onHand: number
  available?: number
  onHold?: number
}

export interface PaginationState {
  pageIndex: number
  hasNextPage: boolean
  accumulatedData: InventoryItem[]
}

export function useInventoryData(apiPayload: any, shouldFetch: boolean) {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 1,
    hasNextPage: false,
    accumulatedData: [],
  })
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)
  const [currentApiPayload, setCurrentApiPayload] = useState(apiPayload)
  const [lastSortingPayload, setLastSortingPayload] = useState<string>("")

  // Create a sorting key to detect sorting changes
  const sortingKey = `${apiPayload.sortColumn}-${apiPayload.sortDirection}`

  // Update current API payload when it changes
  useEffect(() => {
    setCurrentApiPayload(apiPayload)
  }, [apiPayload])

  // Reset pagination and accumulated data when sorting changes
  useEffect(() => {
    if (lastSortingPayload && lastSortingPayload !== sortingKey) {
      console.log("Sorting changed, resetting pagination:", {
        old: lastSortingPayload,
        new: sortingKey
      })
      
      setPaginationState({
        pageIndex: 1,
        hasNextPage: false,
        accumulatedData: [],
      })
      setHasInitiallyLoaded(false)
      
      // Update the API payload to trigger a fresh query
      setCurrentApiPayload(prev => ({
        ...prev,
        pageIndex: 1
      }))
    }
    setLastSortingPayload(sortingKey)
  }, [sortingKey, lastSortingPayload])

  const {
    data: inventoryData,
    isFetching,
    isLoading,
    refetch,
    isSuccess,
    isError,
    error,
  } = useGetInventoryItemsListQuery(currentApiPayload, {
    refetchOnMountOrArgChange: true,
    skip: !shouldFetch,
  })

  // Process API response and map to InventoryItem interface
  const processedItems = useMemo(() => {
    if (!inventoryData?.items) return []

    return inventoryData.items.map(
      (item: any): InventoryItem => ({
        id: item.id || item.sku,
        sku: item.sku,
        warehouse: item.warehouse || item.warehouseName,
        location: item.location || item.locationName,
        palletId: item.pallet,
        inbound: item.inbound || 0,
        outbound: item.outbound || 0,
        adjustment: item.adjustment || 0,
        onHand: item.onHand || item.quantity || 0,
        available: item.available || 0,
        onHold: item.onHold || 0,
      }),
    )
  }, [inventoryData])

  // Update pagination state when new data arrives
  useEffect(() => {
    if (!shouldFetch) {
      setPaginationState({
        pageIndex: 1,
        hasNextPage: false,
        accumulatedData: [],
      })
      setHasInitiallyLoaded(false)
      return
    }

    if (inventoryData?.items) {
      const { items, totalCount } = inventoryData
      const currentPageIndex = currentApiPayload.pageIndex
      const pageSize = currentApiPayload.pageSize
      
      // Calculate if there are more pages
      const totalPages = Math.ceil(totalCount / pageSize)
      const hasMore = currentPageIndex < totalPages && items.length > 0

      setPaginationState((prev) => {
        // If it's the first page or a reset, replace data
        if (currentPageIndex === 1) {
          return {
            pageIndex: currentPageIndex,
            hasNextPage: hasMore,
            accumulatedData: processedItems,
          }
        }
        
        // For subsequent pages, append data only if it's a new page
        if (currentPageIndex > prev.pageIndex) {
          return {
            pageIndex: currentPageIndex,
            hasNextPage: hasMore,
            accumulatedData: [...prev.accumulatedData, ...processedItems],
          }
        }
        
        // If same page, don't change accumulated data
        return {
          ...prev,
          hasNextPage: hasMore,
        }
      })

      // Mark as initially loaded after first successful fetch
      if (!hasInitiallyLoaded && isSuccess) {
        setHasInitiallyLoaded(true)
      }
    }
  }, [
    inventoryData,
    processedItems,
    currentApiPayload.pageIndex,
    currentApiPayload.pageSize,
    shouldFetch,
    isSuccess,
    hasInitiallyLoaded,
  ])

  // Reset initial load state when shouldFetch changes
  useEffect(() => {
    if (!shouldFetch) {
      setHasInitiallyLoaded(false)
    }
  }, [shouldFetch])

  const fetchNextPage = useCallback(async () => {
    if (isLoadingMore || !paginationState.hasNextPage || !shouldFetch) return

    setIsLoadingMore(true)
    try {
      // Update the API payload with the next page
      const nextPagePayload = {
        ...currentApiPayload,
        pageIndex: paginationState.pageIndex + 1,
      }
      
      // Update the current API payload to trigger a new query
      setCurrentApiPayload(nextPagePayload)
      
      // The query will automatically refetch due to the payload change
    } catch (error) {
      console.error('Error fetching next page:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, paginationState.hasNextPage, paginationState.pageIndex, shouldFetch, currentApiPayload])

  const resetPagination = useCallback(() => {
    setPaginationState({
      pageIndex: 1,
      hasNextPage: false,
      accumulatedData: [],
    })
    setHasInitiallyLoaded(false)
    // Reset to first page
    setCurrentApiPayload(prev => ({
      ...prev,
      pageIndex: 1,
    }))
  }, [])

  // Determine loading states
  const isInitialLoading = shouldFetch && (isLoading || (isFetching && !hasInitiallyLoaded))
  const isRefreshing = shouldFetch && isFetching && hasInitiallyLoaded && currentApiPayload.pageIndex === 1

  // Error message processing
  const errorMessage = useMemo(() => {
    if (!isError || !error) return null
    
    // Handle different error types
    if ('status' in error) {
      switch (error.status) {
        case 500:
          return "Server error occurred. Please try again later."
        case 404:
          return "Inventory data not found."
        case 403:
          return "You don't have permission to access this data."
        case 401:
          return "Your session has expired. Please log in again."
        default:
          return `Error ${error.status}: Failed to load inventory data.`
      }
    }
    
    if ('message' in error) {
      return error.message
    }
    
    return "Failed to load inventory data. Please try again."
  }, [isError, error])

  return {
    items: paginationState.accumulatedData,
    totalCount: inventoryData?.totalCount || 0,
    hasNextPage: paginationState.hasNextPage,
    isLoading: isInitialLoading,
    isRefreshing,
    isLoadingMore,
    hasInitiallyLoaded,
    isError,
    errorMessage,
    fetchNextPage,
    resetPagination,
    refetch,
  }
}