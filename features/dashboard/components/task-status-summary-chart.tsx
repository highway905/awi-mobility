"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface TaskStatusSummaryProps {
  className?: string
}

interface TaskStatusData {
  name: string
  value: number
  color: string
}

const inboundData: TaskStatusData[] = [
  { name: "Waiting", value: 47, color: "#9AA5B1" },
  { name: "Yet to Start", value: 82, color: "#2D3748" },
  { name: "In Progress", value: 63, color: "#F6AD55" },
  { name: "On Hold", value: 15, color: "#F56565" },
  { name: "Paused", value: 15, color: "#ECC94B" },
  { name: "Completed", value: 29, color: "#38B2AC" },
]

const outboundData: TaskStatusData[] = [
  { name: "Waiting", value: 38, color: "#9AA5B1" },
  { name: "Yet to Start", value: 65, color: "#2D3748" },
  { name: "In Progress", value: 72, color: "#F6AD55" },
  { name: "On Hold", value: 12, color: "#F56565" },
  { name: "Paused", value: 18, color: "#ECC94B" },
  { name: "Completed", value: 35, color: "#38B2AC" },
]

export function TaskStatusSummaryChart({ className }: TaskStatusSummaryProps) {
  const [activeTab, setActiveTab] = useState("outbound")
  const data = activeTab === "outbound" ? outboundData : inboundData
  
  // Calculate total tasks
  const totalTasks = data.reduce((sum, item) => sum + item.value, 0)

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  // Custom legend
  const renderLegend = () => {
    return (
      <div className="flex flex-col gap-2 text-sm">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <div className="flex justify-between w-full">
              <span className="text-gray-700">{entry.name}</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Task Status Summary</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="outbound">Outbound</TabsTrigger>
              <TabsTrigger value="inbound">Inbound</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-60px)]">
        <div className="flex-1 flex">
          <div className="w-1/2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold"
                >
                  {totalTasks}
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm text-gray-500"
                >
                  Tasks
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 flex items-center">
            {renderLegend()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}