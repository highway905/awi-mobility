"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scan, Package, CheckCircle } from "lucide-react"
import type { Task, UnloadingItem } from "../../types"

interface UnloadingTaskContentProps {
  activeTab: string
  task: Task
}

const mockUnloadingItems: UnloadingItem[] = [
  {
    id: "1",
    sku: "SKU-001",
    description: "Blue T-Shirt",
    expectedQty: 50,
    receivedQty: 48,
    status: "discrepancy",
  },
  {
    id: "2",
    sku: "SKU-002",
    description: "Red Hoodie",
    expectedQty: 25,
    receivedQty: 25,
    status: "completed",
  },
  {
    id: "3",
    sku: "SKU-003",
    description: "Black Jeans",
    expectedQty: 30,
    receivedQty: 0,
    status: "pending",
  },
]

export function UnloadingTaskContent({ activeTab, task }: UnloadingTaskContentProps) {
  const [scannedCode, setScannedCode] = useState("")
  const [items, setItems] = useState(mockUnloadingItems)

  const renderScanTab = () => (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scan Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Scan or enter barcode"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              className="flex-1"
            />
            <Button>Scan</Button>
          </div>
          <div className="text-sm text-gray-600">Scan each item to verify quantities and condition</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-medium">{task.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Type:</span>
            <span className="font-medium">{task.orderType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Priority:</span>
            <Badge variant="outline" className="text-xs">
              {task.priority}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderItemsTab = () => (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Items to Unload
        </h3>
        <Badge variant="outline">{items.length} items</Badge>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{item.sku}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <div className="text-sm">
                    Expected: {item.expectedQty} | Received: {item.receivedQty}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      item.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : item.status === "discrepancy"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {item.status}
                  </Badge>
                  {item.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderSummaryTab = () => {
    const completedItems = items.filter((item) => item.status === "completed").length
    const discrepancyItems = items.filter((item) => item.status === "discrepancy").length
    const pendingItems = items.filter((item) => item.status === "pending").length

    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Unloading Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedItems}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{discrepancyItems}</div>
                <div className="text-sm text-gray-600">Discrepancies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{pendingItems}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Save Progress
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700">Complete Task</Button>
        </div>
      </div>
    )
  }

  switch (activeTab) {
    case "scan":
      return renderScanTab()
    case "items":
      return renderItemsTab()
    case "summary":
      return renderSummaryTab()
    default:
      return renderScanTab()
  }
}
