"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { PageHeader } from "@/components/shared/page-header"
import { SwipeableTabs } from "@/components/shared/swipeable-tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TasksTable } from "./tasks-table"
import { AttachmentsTable } from "./attachments-table"
import { TransportationDetails } from "./transportation-details"
import { ShippingTracking } from "./shipping-tracking"
import { PickingPacking } from "./picking-packing"
import { PricingTable } from "./pricing-table"
import { LogsContent } from "./log-timeline"
import { WarehouseAction } from "./warehouse-action"

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
  const [loading, setLoading] = useState(false)

  // Simulate loading when tab changes
  

  const renderTabContent = (tabId: string) => {
    if (loading) {
      switch (tabId) {
        case "tasks":
        case "attachments":
        case "shipping":
        case "picking":
        case "pricing":
          return null
        case "transportation":
          return null
        default:
          return null
      }
    }

    switch (tabId) {
      case "order-details":
        return (
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
              <CardTitle>Order Information</CardTitle>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-8 flex-1 overflow-y-auto flex flex-col gap-4">
              {/* Basic Information Section */}
              <div className="">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-3 gap-8">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Transaction ID</label>
                      <div className="font-medium">{orderId}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Transaction Type</label>
                      <div className="font-medium">Fulfillment</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Reference ID</label>
                      <div className="font-medium">demo-ob-b2c-009</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Task ID</label>
                      <div className="font-medium">870</div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Customer</label>
                      <div className="font-medium">Blue Flag</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Order Type</label>
                      <div className="font-medium">B2C</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Receipt Advice Number</label>
                      <div className="font-medium">-</div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Created By</label>
                      <div className="font-medium">Admin User 2</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Type</label>
                      <div className="font-medium">Outbound</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">PO Number</label>
                      <div className="font-medium">-</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Address Details</h3>
                <div className="grid grid-cols-2 gap-8">
                  {/* From Address */}
                  <div>
                    <h4 className="text-sm text-gray-500 mb-3">From</h4>
                    <div className="space-y-1">
                      <div className="font-semibold">ABISEC</div>
                      <div>ABISEC C/o Blue Flag</div>
                      <div>Advanced Warehouse - SEC</div>
                      <div>7 ABC Ave.</div>
                      <div>Suite 1</div>
                      <div>Secaucus, New Jersey, 07094</div>
                      <div>United States</div>
                    </div>
                  </div>

                  {/* To Address */}
                  <div>
                    <h4 className="text-sm text-gray-500 mb-3">To</h4>
                    <div className="space-y-1">
                      <div className="font-semibold">Blue Flag</div>
                      <div>Blue Flag</div>
                      <div>lane-01</div>
                      <div>Los Angeles, California, 90001</div>
                      <div>United States</div>
                      <div className="text-sm text-gray-500 mt-2">2/13/2025 12:10 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "tasks":
        return (
          <Card className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <TasksTable />
            </div>
          </Card>
        )
      case "attachments":
        return (
          <Card className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <AttachmentsTable />
            </div>
          </Card>
        )
      case "transportation":
        return (
          <Card className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <TransportationDetails />
            </div>
          </Card>
        )
      case "shipping":
        return (
          <Card className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <ShippingTracking />
            </div>
          </Card>
        )
      case "picking":
        return (
          <Card className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <PickingPacking />
            </div>
          </Card>
        )
      case "pricing":
        return (
          <Card className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <PricingTable />
            </div>
          </Card>
        )
      case "log":
        return <LogsContent />
      case "warehouse":
        return <WarehouseAction />
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

        {/* Swipeable Tabs - Full width and height */}
        <div className="flex-1 min-h-0">
          <SwipeableTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            renderContent={renderTabContent}
          />
        </div>
      </div>
    </div>
  )
}
