"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { OrdersFilter } from "./orders-filter"
import { AdvancedTable } from "@/components/shared/advanced-table"
import { useGetOrderListQuery } from "@/lib/redux/api/orderManagement"
import type { Order } from "../types/order.types"

const breadcrumbItems = [{ label: "Home", href: "/dashboard" }, { label: "Order Management" }]

export function OrdersPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Simple API call for testing
  const { data: ordersResponse, isLoading } = useGetOrderListQuery({
    searchKey: "",
    sortColumn: "transactionId",
    sortDirection: "asc",
    pageIndex: 1,
    pageSize: 50,
  })

  const orders: Order[] = ordersResponse?.result?.orders || []

  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader 
          title="Orders" 
          breadcrumbItems={breadcrumbItems} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <div className="bg-white rounded-lg border h-full p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Orders ({orders.length})</h2>
              <div className="space-y-2">
                {orders.map((order) => (
                  <div key={order.orderId} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-blue-600">{order.transactionId}</span>
                        <span className="ml-3 text-gray-600">{order.customer}</span>
                      </div>
                      <div className="text-sm text-gray-500">{order.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
