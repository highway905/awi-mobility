"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { useOrdersPageSimple } from "../hooks/useOrdersPageSimple"

export function OrdersPageContent() {
  // Use the custom hook for all logic and data
  const {
    // UI State
    sidebarOpen,
    
    // Data
    orders,
    totalCount,
    isLoading,
    error,
    
    // Computed
    breadcrumbItems,
    
    // Handlers
    handleSidebarToggle,
    handleSidebarClose,
  } = useOrdersPageSimple()

  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader 
          title="Orders" 
          breadcrumbItems={breadcrumbItems} 
          onMenuClick={handleSidebarToggle} 
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <div className="bg-white rounded-lg border h-full p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500">Error loading orders</div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Orders ({totalCount})</h2>
              <div className="space-y-2">
                {orders.map((order) => (
                  <div key={order.orderId} className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-blue-600">{order.transactionId}</span>
                        <span className="ml-3 text-gray-600">{order.customer}</span>
                        <span className="ml-3 text-sm text-gray-500">{order.orderType}</span>
                      </div>
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span>Ref: {order.referenceId}</span>
                      <span className="ml-4">Channel: {order.channel}</span>
                      <span className="ml-4">Date: {order.appointmentDate}</span>
                    </div>
                  </div>
                ))}
              </div>
              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
