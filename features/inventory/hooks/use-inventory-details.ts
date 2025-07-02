"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useGetInventoryItemQuery, useGetInventoryAuditLogQuery } from "@/lib/redux/api/inventoryManagement"

export interface InventoryDetails {
  id: string
  sku: string
  name: string
  customer: any
  warehouse: any
  location: any
  pallet: any
  lotNumber: string | null
  expirationDate: string | null
  onHand: number
  available: number
  onHold: number
  inbound: number
  outbound: number
  adjustment: number
}

export interface TransactionHistory {
  id: string
  dateTime: string
  type: string
  transactionId: string
  referenceId: string
  location: string
  inbound: number
  outbound: number
  adjustment: number
  reason: string
  notes: string
  description: string
  createdBy: string
  currentOnHandQty?: number
  currentAvailableQty?: number
  onHoldQty?: number
  reservedQty?: number
}

export const defaultAuditLogFilter = {
  pageIndex: 1,
  pageSize: 50,
  transactionLogType: null,
  inventoryAllocationId: "",
  auditLogType: null,
  transactionId: "",
  referenceId: "",
  reason: "",
  notes: "",
}

export interface PaginationState {
  pageIndex: number
  hasNextPage: boolean
  accumulatedData: TransactionHistory[]
}

export function useInventoryDetails() {
  const params = useParams()
  const searchParams = useSearchParams()

  // URL State Management
  const sku = params.sku ? decodeURIComponent(params.sku as string) : ""
  const inventoryAllocationId = searchParams.get("id") || sku

  // Pagination State
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 1,
    hasNextPage: false,
    accumulatedData: [],
  })

  // Loading state tracking
  const [hasInventoryLoaded, setHasInventoryLoaded] = useState(false)
  const [hasTransactionsLoaded, setHasTransactionsLoaded] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentApiPayload, setCurrentApiPayload] = useState(() => ({
    ...defaultAuditLogFilter,
    inventoryAllocationId,
    pageIndex: 1,
  }))

  // Update API payload when allocation ID changes
  useEffect(() => {
    setCurrentApiPayload(prev => ({
      ...prev,
      inventoryAllocationId,
      pageIndex: 1,
    }))
  }, [inventoryAllocationId])

  // API payload processing
  const apiPayload = useMemo(() => {
    const payload: any = { ...currentApiPayload }
    Object.entries(payload)?.forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) payload[key] = value.map((v) => v?.id)
      else if (value?.id !== undefined) payload[key] = value?.id
    })
    return payload
  }, [currentApiPayload])

  // API Queries
  const inventoryItemQuery = useGetInventoryItemQuery(
    { inventoryAllocationId },
    {
      skip: !inventoryAllocationId,
      refetchOnMountOrArgChange: true,
    },
  )

  const auditLogQuery = useGetInventoryAuditLogQuery(apiPayload, {
    refetchOnMountOrArgChange: true,
    skip: !inventoryAllocationId,
  })

  // Track when inventory data has loaded
  useEffect(() => {
    if (inventoryItemQuery.isSuccess || inventoryItemQuery.isError) {
      setHasInventoryLoaded(true)
    }
  }, [inventoryItemQuery.isSuccess, inventoryItemQuery.isError])

  // Track when transactions data has loaded
  useEffect(() => {
    if (auditLogQuery.isSuccess || auditLogQuery.isError) {
      setHasTransactionsLoaded(true)
    }
  }, [auditLogQuery.isSuccess, auditLogQuery.isError])

  // Process inventory details
  const inventoryDetails: InventoryDetails | null = useMemo(() => {
    if (!inventoryItemQuery.data) return null

    // Extract inventory data from different possible response structures
    let inventoryData = null
    if (inventoryItemQuery.data.response) {
      inventoryData = inventoryItemQuery.data.response
    } else if (inventoryItemQuery.data.data) {
      inventoryData = inventoryItemQuery.data.data
    } else if (inventoryItemQuery.data.result) {
      inventoryData = inventoryItemQuery.data.result
    } else {
      inventoryData = inventoryItemQuery.data
    }

    if (!inventoryData) return null

    const {
      id = inventoryAllocationId,
      sku: apiSku = sku,
      customer = null,
      warehouse = null,
      location = null,
      pallet = null,
      lotNumber = null,
      expirationDate = null,
    } = inventoryData

    // Get audit data if available
    const latestAuditEntry = auditLogQuery.data?.response?.items?.[0]
    const {
      currentOnHandQty = 0,
      currentAvailableQty = 0,
      onHoldQty = 0,
      inboundQty = 0,
      outboundQty = 0,
      adjustedQty = 0,
    } = latestAuditEntry || {}

    return {
      id: id || inventoryAllocationId,
      sku: apiSku || sku,
      name: apiSku || sku,
      customer,
      warehouse,
      location,
      pallet,
      lotNumber,
      expirationDate,
      onHand: currentOnHandQty,
      available: currentAvailableQty,
      onHold: onHoldQty,
      inbound: inboundQty,
      outbound: outboundQty,
      adjustment: adjustedQty,
    }
  }, [inventoryItemQuery.data, auditLogQuery.data, inventoryAllocationId, sku])

  // Process transaction history - FIXED: Remove from dependency array to prevent infinite loop
  const processedTransactions: TransactionHistory[] = useMemo(() => {
    // Extract audit items from different possible response structures
    let auditItems = null
    if (auditLogQuery.data?.response?.items) {
      auditItems = auditLogQuery.data.response.items
    } else if (auditLogQuery.data?.items) {
      auditItems = auditLogQuery.data.items
    } else if (auditLogQuery.data?.data?.items) {
      auditItems = auditLogQuery.data.data.items
    } else if (auditLogQuery.data?.result?.items) {
      auditItems = auditLogQuery.data.result.items
    } else if (Array.isArray(auditLogQuery.data)) {
      auditItems = auditLogQuery.data
    }

    if (!auditItems || !Array.isArray(auditItems)) return []

    return auditItems.map((item: any, index: number): TransactionHistory => {
      const {
        id = `transaction-${index}`,
        date,
        inventoryAuditLogType,
        transactionId,
        referenceId,
        location,
        inboundQty = 0,
        outboundQty = 0,
        adjustedQty = 0,
        reason = "N/A",
        notes = "",
        description = "",
        createdBy,
        currentOnHandQty,
        currentAvailableQty,
        onHoldQty,
        reservedQty,
      } = item

      return {
        id,
        dateTime: date ? new Date(date).toLocaleString() : "N/A",
        type: inventoryAuditLogType || "Unknown",
        transactionId: transactionId || "N/A",
        referenceId: referenceId || "N/A",
        location: location || "N/A",
        inbound: inboundQty,
        outbound: outboundQty,
        adjustment: adjustedQty,
        reason,
        notes,
        description,
        createdBy: createdBy || "N/A",
        currentOnHandQty,
        currentAvailableQty,
        onHoldQty,
        reservedQty,
      }
    })
  }, [auditLogQuery.data])

  // Update pagination state when new data arrives - FIXED: Proper pagination logic
  useEffect(() => {
    if (!inventoryAllocationId) {
      setPaginationState({
        pageIndex: 1,
        hasNextPage: false,
        accumulatedData: [],
      })
      return
    }

    if (auditLogQuery.data) {
      let items = []
      let totalCount = 0

      if (auditLogQuery.data.response?.items) {
        items = auditLogQuery.data.response.items
        totalCount = auditLogQuery.data.response.totalCount || items.length
      } else if (auditLogQuery.data.items) {
        items = auditLogQuery.data.items
        totalCount = auditLogQuery.data.totalCount || items.length
      } else if (auditLogQuery.data.data?.items) {
        items = auditLogQuery.data.data.items
        totalCount = auditLogQuery.data.data.totalCount || items.length
      } else if (Array.isArray(auditLogQuery.data)) {
        items = auditLogQuery.data
        totalCount = items.length
      }

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
            accumulatedData: processedTransactions,
          }
        }
        
        // For subsequent pages, append data only if it's a new page
        if (currentPageIndex > prev.pageIndex) {
          return {
            pageIndex: currentPageIndex,
            hasNextPage: hasMore,
            accumulatedData: [...prev.accumulatedData, ...processedTransactions],
          }
        }
        
        // If same page, don't change accumulated data
        return {
          ...prev,
          hasNextPage: hasMore,
        }
      })
    }
  }, [
    auditLogQuery.data,
    processedTransactions,
    currentApiPayload.pageIndex,
    currentApiPayload.pageSize,
    inventoryAllocationId,
  ])

  // Reset pagination when allocation ID changes
  useEffect(() => {
    setPaginationState({
      pageIndex: 1,
      hasNextPage: false,
      accumulatedData: [],
    })
    setHasInventoryLoaded(false)
    setHasTransactionsLoaded(false)
  }, [inventoryAllocationId])

  // FIXED: Proper fetchNextPage implementation
  const fetchNextPage = useCallback(async () => {
    if (isLoadingMore || !paginationState.hasNextPage || !inventoryAllocationId) return

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
  }, [isLoadingMore, paginationState.hasNextPage, paginationState.pageIndex, inventoryAllocationId, currentApiPayload])

  return {
    sku,
    inventoryAllocationId,
    inventoryDetails,
    transactions: paginationState.accumulatedData,
    hasNextPage: paginationState.hasNextPage,
    fetchNextPage,
    isInitialLoading: inventoryItemQuery.isLoading || auditLogQuery.isLoading,
    isTransactionsLoading: auditLogQuery.isFetching,
    inventoryError: inventoryItemQuery.error,
    transactionsError: auditLogQuery.error,
    inventorySuccess: inventoryItemQuery.isSuccess,
    hasInventoryLoaded,
    hasTransactionsLoaded,
  }
}