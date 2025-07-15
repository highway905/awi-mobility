"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { OrderStatusSection } from "@/features/dashboard/components/order-status-section"
import { CurrentTasksTable } from "@/features/dashboard/components/current-tasks-table"
import { NeedsAttentionTable } from "@/features/dashboard/components/needs-attention-table"
import { ChartPlaceholder } from "@/features/dashboard/components/chart-placeholder"
import { TaskStatusSummaryChart } from "@/features/dashboard/components/task-status-summary-chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AuthGuard from "@/routes/AuthGuard"

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard" }]

const filterOptions = [
  { value: "abisec", label: "ABISEC" },
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
]
const warehouseOptions = [
  { value: "awisec", label: "AWISEC" },
  { value: "warehouse-b", label: "Warehouse B" },
  { value: "warehouse-c", label: "Warehouse C" },
]
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedWarehouseValue, setSelectedWarehouseValue] = useState(warehouseOptions[0].value)

  return (
    <AuthGuard>
      <div className="bg-dashboard-background min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content - NO margin shift, sidebar overlays */}
        <div className="px-4">
          <div className="space-y-dashboard-gap">
            {/* Combined Page Header */}
            <PageHeader
              title="Dashboard"
              breadcrumbItems={breadcrumbItems}
              filterValue="abisec"
              filterOptions={filterOptions}
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              actions={
                <div className="w-[214px]">
                <Select value={selectedWarehouseValue} onValueChange={setSelectedWarehouseValue}>
                    <SelectTrigger className="w-[214px] text-gray-700 border-gray-300 hover:bg-gray-50">
                      <SelectValue placeholder="Select Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              }
            />

            {/* Order Status Section */}
            <OrderStatusSection />

            {/* Chart Containers */}
            <div className="flex gap-chart-gap">
              <ChartPlaceholder
                title="Task Status"
                description="Horizontal bar chart showing task progress"
                className="w-chart-container flex-1 "
              />
              <TaskStatusSummaryChart
                className="w-chart-container flex-1"
              />
            </div>

            {/* Tables */}
            <CurrentTasksTable />
            <NeedsAttentionTable />
          </div>
        </div>
      </div>
    </AuthGuard>
  )

}