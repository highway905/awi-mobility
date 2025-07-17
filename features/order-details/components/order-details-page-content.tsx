"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { SwipeableTabs } from "@/features/shared/components/swipeable-tabs"
import { GlobalLoader, GlobalErrorFallback } from "@/components/shared"
import { TasksTable } from "./tasks-table"
import { AttachmentsTable, AttachmentsActions } from "./attachments-table"
import { TransportationDetails } from "./transportation-details"
import { ShippingTracking } from "./shipping-tracking"
import { PickingPacking, PickingPackingActions } from "./picking-packing"
import { LogsContent } from "./log-timeline"
import { WarehouseAction } from "./warehouse-action"
import { TabContentWrapper } from "./tabs/tab-content-wrapper"
import { OrderInformation } from "./tabs"
import { OrderDetailsHeader } from "./order-details-header"
import { tabs, TabType } from "../utils/tab-helpers"
import { useOrderDetailsPage } from "../hooks/useOrderDetailsPage"
import { 
  TableSkeleton, 
  OrderInfoSkeleton, 
  TimelineSkeleton, 
  CardsSkeleton 
} from "./tabs/tab-skeletons"

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
    if (hasError) {
      return (
        <GlobalErrorFallback
          variant="card"
          error={errorMessage}
          title="Failed to load order details"
          description="We encountered an error while loading the order details. Please try again."
          onRetry={handleRetry}
          showRetry={true}
        />
      )
    }

    if (isEmpty) {
      return (
        <GlobalErrorFallback
          variant="card"
          title="No order details found"
          description="The requested order could not be found. It may have been deleted or moved."
          showRetry={false}
          showBack={true}
          onBack={() => window.history.back()}
        />
      )
    }

    // Show skeleton loading when overall loading is true
    if (isOverallLoading) {
      switch (tabId) {
        case "order-details":
          return (
            <TabContentWrapper hasCard={true}>
              <OrderInfoSkeleton />
            </TabContentWrapper>
          )
        case "tasks":
          return (
            <TabContentWrapper title="Tasks" hasCard={true}>
              <TableSkeleton />
            </TabContentWrapper>
          )
        case "attachments":
          return (
            <TabContentWrapper title="Attachments" actions={<AttachmentsActions />} hasCard={true}>
              <TableSkeleton />
            </TabContentWrapper>
          )
        case "transportation":
          return (
            <TabContentWrapper title="Transportation Details" hasCard={true}>
              <CardsSkeleton />
            </TabContentWrapper>
          )
        case "shipping":
          return (
            <TabContentWrapper title="Shipping & Tracking" hasCard={true}>
              <TableSkeleton />
            </TabContentWrapper>
          )
        case "picking":
          return (
            <TabContentWrapper title="Picking & Packing" actions={<PickingPackingActions />} hasCard={true}>
              <TableSkeleton />
            </TabContentWrapper>
          )
        case "log":
          return (
            <TabContentWrapper hasCard={true}>
              <TimelineSkeleton />
            </TabContentWrapper>
          )
        case "warehouse":
          return (
            <TabContentWrapper title="Warehouse Actions" hasCard={true}>
              <TableSkeleton />
            </TabContentWrapper>
          )
        default:
          return (
            <TabContentWrapper>
              <OrderInfoSkeleton />
            </TabContentWrapper>
          )
      }
    }

    switch (tabId) {
      case "order-details":
        return (
          <TabContentWrapper hasCard={true}>
            <OrderInformation orderDetails={orderDetails} />
          </TabContentWrapper>
        )
      case "tasks":
        return (
          <TabContentWrapper title="Tasks" hasCard={true}>
            <TasksTable orderDetails={orderDetails} />
          </TabContentWrapper>
        )
      case "attachments":
        return (
          <TabContentWrapper title="Attachments" actions={<AttachmentsActions />} hasCard={true}>
            <AttachmentsTable attachments={safeData?.attachments || []} />
          </TabContentWrapper>
        )
      case "transportation":
        return (
          <TabContentWrapper title="Transportation Details" hasCard={true}>
            <TransportationDetails 
              handlingDetails={safeData?.handlingDetails}
              transportationSchedule={safeData?.transportationSchedule}
              carrierDetails={safeData?.carrierDetails}
            />
          </TabContentWrapper>
        )
      case "shipping":
        return (
          <TabContentWrapper title="Shipping & Tracking" hasCard={true}>
            <ShippingTracking 
              trackingDetails={safeData?.trackingDetails}
              deliveryDetails={safeData?.deliveryDetails}
            />
          </TabContentWrapper>
        )
      case "picking":
        return (
          <TabContentWrapper title="Picking & Packing" actions={<PickingPackingActions />} hasCard={true}>
            <PickingPacking lineItems={safeData?.lineItems || []} />
          </TabContentWrapper>
        )
      case "log":
        return (
          <TabContentWrapper hasCard={true}>
            <LogsContent logs={safeData?.orderLogs || []} taskLogs={safeData?.taskLogs || []} />
          </TabContentWrapper>
        )
      case "warehouse":
        return (
          <TabContentWrapper title="Warehouse Actions" hasCard={true}>
            <WarehouseAction 
              instructions={safeData?.instructions || undefined} 
              lineItems={safeData?.lineItems || []}
              palletLabelsData={palletLabelsData}
              palletLabelsError={palletLabelsError}
              palletLabelsLoading={palletLabelsLoading}
            />
          </TabContentWrapper>
        )
      default:
        return (
          <TabContentWrapper>
            <p className="text-gray-500">Content not found</p>
          </TabContentWrapper>
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
