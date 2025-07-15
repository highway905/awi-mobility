"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "../../types"

interface IBQATaskContentProps {
  activeTab: string
  task: Task
}

export function IBQATaskContent({ activeTab, task }: IBQATaskContentProps) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>IB Quality Assurance - {activeTab}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            IBQA task content for {task.transactionId} - {activeTab} tab
          </p>
          <p className="text-sm text-gray-500 mt-2">This content will be implemented based on IBQA requirements.</p>
        </CardContent>
      </Card>
    </div>
  )
}
