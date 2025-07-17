"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock } from "lucide-react"

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
  isLoading?: boolean
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
  // Show empty state only if we have definitive empty data (not loading)
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          {title.includes('Order') ? (
            <FileText className="w-8 h-8 text-gray-400" />
          ) : (
            <Clock className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No {title}</h3>
        <p className="text-gray-500 text-center text-sm">
          {title.includes('Order') 
            ? "No order activities have been logged yet." 
            : "No task activities have been logged yet."
          }
        </p>
      </div>
    )
  }

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

export function LogsContent({ logs, taskLogs = [], isLoading = false }: LogsContentProps) {
  // Sort logs by date in descending order (newest first)
  const sortedOrderLogs = [...(logs || [])].sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  )
  
  // Sort task logs by creation date (newest first)
  const sortedTaskLogs = (taskLogs || []).length > 0 
    ? [...(taskLogs || [])].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    : []

  return (
    <Card className="h-full flex flex-col border-none">
      {/* <CardHeader>
        <CardTitle>Log Timeline</CardTitle>
      </CardHeader> */}
      <CardContent className="overflow-auto h-full">
        <div className="h-full flex flex-col md:flex-row md:divide-x md:divide-gray-200">
          <div className="flex-1 md:pr-6">
            <LogTimeline logs={sortedOrderLogs} title="Order Logs" />
          </div>
          <div className="flex-1 md:pl-6">
            <LogTimeline logs={sortedTaskLogs} title="Task Logs" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
