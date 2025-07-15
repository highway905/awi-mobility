"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaskStatusChartProps {
  className?: string
}

// Sample data for the chart
const outboundData = [
  { name: "Unloading", waiting: 10, yetToStart: 15, hold: 5, paused: 8, inProgress: 25, completed: 12 },
  { name: "Sorting", waiting: 8, yetToStart: 12, hold: 3, paused: 5, inProgress: 20, completed: 15 },
  { name: "IB QA", waiting: 5, yetToStart: 8, hold: 2, paused: 4, inProgress: 15, completed: 10 },
  { name: "Receiving and Put Away", waiting: 12, yetToStart: 18, hold: 6, paused: 9, inProgress: 22, completed: 14 },
  { name: "Review Overage / Underage", waiting: 7, yetToStart: 10, hold: 4, paused: 6, inProgress: 18, completed: 16 },
]

const inboundData = [
  { name: "Unloading", waiting: 12, yetToStart: 18, hold: 7, paused: 10, inProgress: 30, completed: 15 },
  { name: "Sorting", waiting: 10, yetToStart: 15, hold: 5, paused: 8, inProgress: 25, completed: 18 },
  { name: "IB QA", waiting: 8, yetToStart: 12, hold: 4, paused: 6, inProgress: 20, completed: 12 },
  { name: "Receiving and Put Away", waiting: 15, yetToStart: 22, hold: 8, paused: 12, inProgress: 28, completed: 17 },
  { name: "Review Overage / Underage", waiting: 9, yetToStart: 14, hold: 6, paused: 9, inProgress: 22, completed: 19 },
]

// Colors for the bars
const colors = {
  waiting: "#A1A1AA", // gray
  yetToStart: "#1E293B", // dark blue/gray
  hold: "#EF4444", // red
  paused: "#F59E0B", // amber
  inProgress: "#F97316", // orange
  completed: "#10B981", // green
}

export function TaskStatusChart({ className }: TaskStatusChartProps) {
  const [activeTab, setActiveTab] = useState("outbound")
  const data = activeTab === "outbound" ? outboundData : inboundData

  // Calculate the maximum value for X-axis
  const getMaxValue = () => {
    let max = 0;
    data.forEach(item => {
      const total = item.waiting + item.yetToStart + item.hold + item.paused + item.inProgress + item.completed;
      if (total > max) max = total;
    });
    // Round up to the nearest 10
    return Math.ceil(max / 10) * 10;
  };

  // Generate custom ticks with increments of 10
  const generateCustomTicks = () => {
    const maxValue = getMaxValue();
    const ticks = [];
    // Create ticks from 0 to maxValue + 20 (two extra ticks) with step of 10
    for (let i = 0; i <= maxValue + 20; i += 10) {
      ticks.push(i);
    }
    return ticks;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Task Status</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="outbound">Outbound</TabsTrigger>
              <TabsTrigger value="inbound">Inbound</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full px-6 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: -30, bottom: 5 }}
              barGap={2}
              barSize={12}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                ticks={generateCustomTicks()}
                domain={[0, 'dataMax + 10']}
                hide={true}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
                tickLine={false}
                axisLine={false}
                tick={{ 
                  fontSize: 12,
                  width: 100,
                  textAnchor: 'end'
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const nameStr = String(name);
                  const formattedName = nameStr.charAt(0).toUpperCase() + nameStr.slice(1).replace(/([A-Z])/g, ' $1');
                  return [`${value} tasks`, formattedName];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="waiting" stackId="a" radius={[8, 0, 0, 8]}>
                {data.map((_, index) => (
                  <Cell key={`cell-waiting-${index}`} fill={colors.waiting} />
                ))}
              </Bar>
              <Bar dataKey="yetToStart" stackId="a" radius={[0, 0, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-yetToStart-${index}`} fill={colors.yetToStart} />
                ))}
              </Bar>
              <Bar dataKey="hold" stackId="a" radius={[0, 0, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-hold-${index}`} fill={colors.hold} />
                ))}
              </Bar>
              <Bar dataKey="paused" stackId="a" radius={[0, 0, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-paused-${index}`} fill={colors.paused} />
                ))}
              </Bar>
              <Bar dataKey="inProgress" stackId="a" radius={[0, 0, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-inProgress-${index}`} fill={colors.inProgress} />
                ))}
              </Bar>
              <Bar dataKey="completed" stackId="a" radius={[0, 8, 8, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-completed-${index}`} fill={colors.completed} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 px-6 pb-6">
          <div className="flex  gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.waiting }}></div>
            <span className="text-sm text-gray-600">Waiting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.yetToStart }}></div>
            <span className="text-sm text-gray-600">Yet to Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.hold }}></div>
            <span className="text-sm text-gray-600">Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.paused }}></div>
            <span className="text-sm text-gray-600">Paused</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.inProgress }}></div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.completed }}></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}