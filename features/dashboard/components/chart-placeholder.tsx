"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskStatusChart } from "./task-status-chart"

interface ChartPlaceholderProps {
  title: string
  description?: string
  className?: string
}

export function ChartPlaceholder({ title, description, className }: ChartPlaceholderProps) {
  const [activeTab, setActiveTab] = useState("outbound")
  
  if (title === "Task Status") {
    return <TaskStatusChart className={className} />
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between">
        {title}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="outbound">Outbound</TabsTrigger>
              <TabsTrigger value="inbound">Inbound</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="text-sm font-medium">
          {title}
          
          </div>
          {description && <div className="text-xs mt-1">{description}</div>}
        </div>
      </CardContent>
    </Card>
  )
}