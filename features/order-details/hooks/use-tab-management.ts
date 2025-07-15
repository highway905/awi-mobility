"use client"

import { useState, useEffect } from 'react'

export function useTabManagement(defaultTabId: string) {
  const [activeTab, setActiveTab] = useState(defaultTabId)
  const [loading, setLoading] = useState(false)
  
  // Handle tab change with loading state
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }
  
  // Apply loading effect when tab changes
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500) // 500ms loading simulation
    
    return () => clearTimeout(timer)
  }, [activeTab])
  
  return {
    activeTab,
    loading,
    handleTabChange
  }
}
