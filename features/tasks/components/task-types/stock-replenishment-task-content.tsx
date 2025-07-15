"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "../../types"

interface StockReplenishmentTaskContentProps {
  activeTab: string
  task: Task
}

export function StockReplenishmentTaskContent({ activeTab, task }: StockReplenishmentTaskContentProps) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Replenishment - {activeTab}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Stock replenishment task content for {task.transactionId} - {activeTab} tab
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This content will be implemented based on replenishment requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
