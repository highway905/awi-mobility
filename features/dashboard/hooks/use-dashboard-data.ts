"use client"

import { useState, useEffect } from "react"
import type { OrderStatus, Task, AttentionItem } from "../types"
import { outboundOrderData, currentTasksData, needsAttentionData } from "../mocks/dashboard-data"

export function useDashboardData() {
  const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([])
  const [currentTasks, setCurrentTasks] = useState<Task[]>([])
  const [needsAttention, setNeedsAttention] = useState<AttentionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOrderStatus(outboundOrderData)
      setCurrentTasks(currentTasksData)
      setNeedsAttention(needsAttentionData)
      setLoading(false)
    }

    fetchData()
  }, [])

  return {
    orderStatus,
    currentTasks,
    needsAttention,
    loading,
  }
}
