"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scan, Package, CheckCircle } from "lucide-react"
import type { Task } from "../../types"

interface SortingTaskContentProps {
  activeTab: string
  task: Task
}

export function SortingTaskContent({ activeTab, task }: SortingTaskContentProps) {
  const renderScanTab = () => (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scan Items for Sorting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Scan or enter barcode" className="flex-1" />
            <Button>Scan</Button>
          </div>
          <div className="text-sm text-gray-600">Scan each item to sort into appropriate categories</div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSortTab = () => (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Package className="h-5 w-5" />
        Sort Items
      </h3>
      <div className="text-gray-600">Sort scanned items into designated areas or categories.</div>
    </div>
  )

  const renderCompleteTab = () => (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Complete Sorting Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Save Progress
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">Complete Task</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  switch (activeTab) {
    case "scan":
      return renderScanTab()
    case "sort":
      return renderSortTab()
    case "complete":
      return renderCompleteTab()
    default:
      return renderScanTab()
  }
}
