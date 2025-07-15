"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "../../types"

interface ReceivingPutawayTaskContentProps {
  activeTab: string
  task: Task
}

export function ReceivingPutawayTaskContent({ activeTab, task }: ReceivingPutawayTaskContentProps) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Receiving & Putaway - {activeTab}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Receiving & Putaway task content for {task.transactionId} - {activeTab} tab
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This content will be implemented based on receiving and putaway requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
