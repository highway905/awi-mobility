"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { SwipeableTabs } from "@/features/shared/components/swipeable-tabs"
import { OrderBasicInfo } from "./order-basic-info"
import { OrderAddressDetails } from "./order-address-details"

interface OrderDetailsPageContentProps {
  orderId: string
}

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Orders", href: "/orders" },
]

const tabs = [
  { id: "order-details", label: "Order Details" },
  { id: "tasks", label: "Tasks" },
  { id: "attachments", label: "Attachments" },
  { id: "transportation", label: "Transportation Details" },
  { id: "shipping", label: "Shipping & Tracking" },
  { id: "picking", label: "Picking & Packing" },
  { id: "pricing", label: "Pricing" },
  { id: "log", label: "Log" },
  { id: "warehouse", label: "Warehouse Action" },
]

export function OrderDetailsPageContent({ orderId }: OrderDetailsPageContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("order-details")

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case "order-details":
        return (
          <div className="space-y-6">
            <OrderBasicInfo orderId={orderId} />
            <OrderAddressDetails orderId={orderId} />
          </div>
        )
      case "tasks":
        return <div className="p-6">Tasks content coming soon...</div>
      case "attachments":
        return <div className="p-6">Attachments content coming soon...</div>
      case "transportation":
        return <div className="p-6">Transportation Details content coming soon...</div>
      case "shipping":
        return <div className="p-6">Shipping & Tracking content coming soon...</div>
      case "picking":
        return <div className="p-6">Picking & Packing content coming soon...</div>
      case "pricing":
        return <div className="p-6">Pricing content coming soon...</div>
      case "log":
        return <div className="p-6">Log content coming soon...</div>
      case "warehouse":
        return <div className="p-6">Warehouse Action content coming soon...</div>
      default:
        return <div className="p-6">Content not found</div>
    }
  }

  return (
    <div className="bg-dashboard-background min-h-screen flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <div className="px-4">
          <div className="max-w-dashboard mx-auto w-full">
            {/* Page Header - 72px */}
            <div className="mb-dashboard-gap">
              <PageHeader
                title={
                  <div className="flex items-center gap-3">
                    <span>{orderId}</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">B2C</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        Unloading
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Shipping Label Cancelled
                      </span>
                    </div>
                  </div>
                }
                breadcrumbItems={[...breadcrumbItems, { label: orderId }]}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              />
            </div>
          </div>
        </div>

        {/* Swipeable Tabs - Full width */}
        <SwipeableTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} renderContent={renderTabContent} />
      </div>
    </div>
  )
}
