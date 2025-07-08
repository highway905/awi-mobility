"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OrderLog {
  id: string
  orderDetails: string
  notes: string | null
  user: string
  createdDate: string
}

interface TaskLog {
  id: string
  taskDetails: string
  notes: string | null
  user: string
  createdDate: string
  taskStatus?: string
}

interface LogTimelineProps {
  logs: OrderLog[] | TaskLog[]
  title: string
}

interface LogsContentProps {
  logs: OrderLog[]
  taskLogs?: TaskLog[]
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    return dateString
  }
}

function LogTimeline({ logs, title }: LogTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-8">
        {logs.map((log, index) => (
          <div key={log.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0 mt-1" />
              {index < logs.length - 1 && (
                <div className="w-px h-16 bg-gray-200 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="font-medium text-gray-900 text-base">
                {'orderDetails' in log ? log.orderDetails : log.taskDetails}
              </div>
              {log.notes && (
                <div className="text-sm text-gray-700 mt-1">{log.notes}</div>
              )}
              <div className="flex justify-between mt-2">
                <div className="text-sm text-gray-500">By {log.user}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(log.createdDate)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LogsContent({ logs, taskLogs = [] }: LogsContentProps) {
  // Sort logs by date in descending order (newest first)
  const sortedOrderLogs = [...logs].sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  )
  
  // Mock task logs for example purposes if none are provided
  const sortedTaskLogs = taskLogs.length > 0 
    ? [...taskLogs].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    : [
        {
          id: "task-1",
          taskDetails: "Inventory check completed",
          notes: "All items verified and counted",
          user: "John Doe",
          createdDate: "2025-06-20T10:30:00Z",
          taskStatus: "Completed"
        },
        {
          id: "task-2",
          taskDetails: "QC inspection initiated",
          notes: null,
          user: "Sarah Smith",
          createdDate: "2025-06-19T14:15:00Z",
          taskStatus: "In Progress"
        }
      ];

  return (
    <Card className="h-full flex flex-col">
      
      <CardContent className="overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4">
            <LogTimeline logs={sortedOrderLogs} title="Order Logs" />
          </div>
          <div className=" p-4">
            <LogTimeline logs={sortedTaskLogs} title="Task Logs" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
