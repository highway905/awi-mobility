"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { SwipeableTabs } from "@/features/shared/components/swipeable-tabs"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { TasksTable } from "./tasks-table"
import { AttachmentsTable } from "./attachments-table"
import { TransportationDetails } from "./transportation-details"
import { ShippingTracking } from "./shipping-tracking"
import { PickingPacking } from "./picking-packing"
import { TabLoadingSkeleton } from "./tab-loading-skeleton"
import { LogsContent } from "./log-timeline"
import { WarehouseAction } from "./warehouse-action"
import { OrderInformation } from "./tabs"
import { OrderDetailsHeader } from "./order-details-header"
import { tabs, getSkeletonTypeForTab, TabType } from "../utils/tab-helpers"
import { useOrderDetailsPage } from "../hooks/useOrderDetailsPage"

interface OrderDetailsPageContentProps {
  orderId: string
}

export function OrderDetailsPageContent({ orderId }: OrderDetailsPageContentProps) {
  // Use the consolidated custom hook
  const {
    // UI State
    sidebarOpen,
    activeTab,
    
    // Data State
    orderDetails,
    safeData,
    isOverallLoading,
    hasError,
    errorMessage,
    isEmpty,
    
    // Order Info
    transactionId,
    orderStatus,
    serviceType,
    shippingStatus,
    
    // Pallet Labels
    palletLabelsData,
    palletLabelsError,
    palletLabelsLoading,
    
    // Computed
    breadcrumbItems,
    
    // Handlers
    handleTabChange,
    handleSidebarToggle,
    handleSidebarClose,
    handleRetry
  } = useOrderDetailsPage({ orderId })

  const renderTabContent = (tabId: string) => {
    if (isOverallLoading) {
      return <TabLoadingSkeleton type={getSkeletonTypeForTab(tabId as TabType)} />
    }

    if (hasError) {
      return (
        <Card className="h-full flex flex-col">
          <div className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{errorMessage}</p>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </Card>
      )
    }

    if (isEmpty) {
      return (
        <Card className="h-full flex flex-col items-center justify-center">
          <div className="p-6">
            <p className="text-gray-500">No order details found</p>
          </div>
        </Card>
      )
    }

    if (!orderDetails || !safeData) {
      return (
        <Card className="h-full flex flex-col">
          <div className="p-6">
            <p className="text-gray-500">Failed to load order details</p>
          </div>
        </Card>
      )
    }

    switch (tabId) {
      case "order-details":
        return <OrderInformation orderDetails={orderDetails} />
      case "tasks":
        return <TasksTable orderDetails={orderDetails} />
      case "attachments":
        return <AttachmentsTable attachments={safeData.attachments} />
      case "transportation":
        return <TransportationDetails 
          handlingDetails={safeData.handlingDetails}
          transportationSchedule={safeData.transportationSchedule}
          carrierDetails={safeData.carrierDetails}
        />
      case "shipping":
        return <ShippingTracking 
          trackingDetails={safeData.trackingDetails}
          deliveryDetails={safeData.deliveryDetails}
        />
      case "picking":
        return <PickingPacking lineItems={safeData.lineItems} />
      case "log":
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-bold text-lg p-2">Log Timeline</CardTitle>
            </CardHeader>
            <CardContent className="border-none">
              <LogsContent logs={safeData.orderLogs} taskLogs={safeData.taskLogs} />
            </CardContent>
          </Card>
        )
      case "warehouse":
        return (
          <Card className="h-full flex flex-col p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl font-semibold">Warehouse Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-none">
              <WarehouseAction 
                instructions={safeData.instructions} 
                lineItems={safeData.lineItems}
                palletLabelsData={palletLabelsData}
                palletLabelsError={palletLabelsError}
                palletLabelsLoading={palletLabelsLoading}
              />
            </CardContent>
          </Card>
        )
      default:
        return (
          <Card className="h-full flex flex-col">
            <div className="p-6">
              <p className="text-gray-500">Content not found</p>
            </div>
          </Card>
        )
    }
  }

  return (
    <div className="bg-dashboard-background h-screen flex flex-col overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 flex-shrink-0">
          <div className="max-w-dashboard mx-auto w-full">
            {/* Page Header */}
            <div className="mb-dashboard-gap">
              <OrderDetailsHeader
                orderId={transactionId}
                orderType={serviceType}
                status={orderStatus}
                shippingStatus={shippingStatus}
                breadcrumbItems={breadcrumbItems}
                onMenuClick={handleSidebarToggle}
              />
            </div>
          </div>
        </div>

        {/* Swipeable Tabs - Full width and height */}
        <div className="flex-1 overflow-hidden">
          <SwipeableTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            renderContent={renderTabContent}
          />
        </div>
      </div>
    </div>
  )
}
