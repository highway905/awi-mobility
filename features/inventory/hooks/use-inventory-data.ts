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
  reserved?: number
  description?: string
  universalProductCode?: string
  lotNumber?: string
  expirationDate?: string
  serialNumber?: string
  poNumber?: string
  receivedDate?: string
  referenceId?: string
  weightImperial?: number
  weightMetric?: number
  volumeCubicInches?: number
  volumeCubicFeet?: number
  notes?: string
  customer?: string
  transactionDate?: string
  locationTypeName?: string
  box?: string
  itemName?: string
  isTransloadSku?: boolean
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
  const [lastCustomerId, setLastCustomerId] = useState<string>("")

  // Create a sorting key to detect sorting changes
  const sortingKey = `${apiPayload.sortColumn}-${apiPayload.sortDirection}`

  // Update current API payload when it changes
  useEffect(() => {
    setCurrentApiPayload(apiPayload)
  }, [apiPayload])

  // Reset pagination and accumulated data when customer changes
  useEffect(() => {
    if (lastCustomerId && lastCustomerId !== apiPayload.customerId) {
      console.log("Customer changed, resetting pagination:", {
        old: lastCustomerId,
        new: apiPayload.customerId
      })
      
      setPaginationState({
        pageIndex: 1,
        hasNextPage: false,
        accumulatedData: [],
      })
      setHasInitiallyLoaded(false) // This will trigger skeleton loading
      
      // Update the API payload to trigger a fresh query
      setCurrentApiPayload(prev => ({
        ...prev,
        pageIndex: 1
      }))
    }
    setLastCustomerId(apiPayload.customerId)
  }, [apiPayload.customerId, lastCustomerId])

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
    console.log("Processing inventory data...", inventoryData.items)

    return inventoryData.items.map(
      (item: any): InventoryItem => ({
        id: item.id,
        sku: item.sku,
        warehouse: item.warehouse,
        location: item.locationDisplayName,
        palletId: item.pallet,
        inbound: item.inboundQty || 0,
        outbound: item.outboundQty || 0,
        adjustment: item.adjustedQty || 0,
        onHand: item.onHandQty || 0,
        available: item.availableQty || 0,
        onHold: item.onHoldQty || 0,
        reserved: item.reservedQty || 0,
        description: item.description,
        universalProductCode: item.universalProductCode,
        lotNumber: item.lotNumber,
        expirationDate: item.expirationDate,
        serialNumber: item.serialNumber,
        poNumber: item.poNumber,
        receivedDate: item.receivedDate,
        referenceId: item.referenceId,
        weightImperial: item.weightImperial,
        weightMetric: item.weightMetric,
        volumeCubicInches: item.volumeCubicInches,
        volumeCubicFeet: item.volumeCubicFeet,
        notes: item.note,
        customer: item.customer,
        transactionDate: item.transactionDate,
        locationTypeName: item.locationTypeName,
        box: item.box,
        itemName: item.itemName,
        isTransloadSku: item.isTransloadSku,
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

  // Debug loading states
  useEffect(() => {
    console.log("useInventoryData loading states:", {
      shouldFetch,
      isLoading,
      isFetching,
      hasInitiallyLoaded,
      isInitialLoading,
      isRefreshing,
      currentPageIndex: currentApiPayload.pageIndex,
      itemsCount: processedItems.length,
      inventoryDataExists: !!inventoryData?.items
    })
  }, [shouldFetch, isLoading, isFetching, hasInitiallyLoaded, isInitialLoading, isRefreshing, currentApiPayload.pageIndex, processedItems.length, inventoryData?.items])

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