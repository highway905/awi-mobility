"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { NoData, NoDataIcons } from "./no-data"
import type { Task } from "../types"
import type { OrderDetailsResponse, TaskLog } from "../types/order-details.types"

interface TasksTableProps {
  orderDetails?: OrderDetailsResponse;
}

// Status styling for task statuses
const statusStyles = {
  "In Progress": "bg-orange-100 text-orange-800",
  "Paused": "bg-purple-100 text-purple-800",
  "On Hold": "bg-pink-100 text-pink-800",
  "Yet to Start": "bg-cyan-100 text-cyan-800",
  "Waiting": "bg-yellow-100 text-yellow-800",
  "Started": "bg-green-100 text-green-800",
  "Completed": "bg-blue-100 text-blue-800",
} as const

// Transform task logs to tasks for display
const transformTaskLogsToTasks = (taskLogs: TaskLog[]): Task[] => {
  return taskLogs.map((log, index) => ({
    id: log.id || `task-${index}`,
    task: log.taskDetails || 'Unknown Task',
    assignedTo: log.user || null,
    priority: "Medium" as const, // Default priority since not in API
    status: (log.taskStatus as any) || "Waiting" as const
  }))
}

const columns: DataTableColumn<Task>[] = [
  {
    key: "task",
    header: "Task",
    className: "font-medium",
  },
  {
    key: "assignedTo",
    header: "Assigned To",
    render: (value: string | null) => {
      if (!value) {
        return (
          <Button variant="outline" size="sm" className="h-8 px-3 bg-gray-100 text-gray-600 border-gray-300">
            Assign To
          </Button>
        )
      }
      return <span>{value}</span>
    },
  },
  {
    key: "priority",
    header: "Priority",
  },
  {
    key: "status",
    header: "Status",
    render: (value: string) => (
      <span
        className={cn("px-2 py-1 rounded-full text-xs font-medium", statusStyles[value as keyof typeof statusStyles])}
      >
        {value}
      </span>
    ),
  },
  {
    key: "id",
    header: "",
    render: () => (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1.4353C11.6253 1.43535 14.5645 4.3744 14.5645 7.99976C14.5644 11.6251 11.6253 14.5642 8 14.5642C4.37465 14.5642 1.4356 11.6251 1.43555 7.99976C1.43555 4.37437 4.37461 1.4353 8 1.4353ZM8 1.44897C4.38197 1.44897 1.44922 4.38174 1.44922 7.99976C1.44927 11.6177 4.382 14.5505 8 14.5505C11.6179 14.5505 14.5507 11.6177 14.5508 7.99976C14.5508 4.38177 11.618 1.44903 8 1.44897ZM8 4.76636C8.01828 4.76636 8.03299 4.78133 8.0332 4.79956V7.96655H11.2002C11.2185 7.96666 11.2333 7.98146 11.2334 7.99976C11.2334 8.01814 11.2185 8.03285 11.2002 8.03296H8.0332V11.2C8.0332 11.2183 8.01838 11.2332 8 11.2332C7.98163 11.2331 7.9668 11.2183 7.9668 11.2V8.03296H4.7998C4.7815 8.03284 4.7666 8.01809 4.7666 7.99976C4.76671 7.98151 4.78157 7.96667 4.7998 7.96655H7.9668V4.79956C7.96701 4.78134 7.98174 4.76637 8 4.76636Z" fill="#0C0A09" stroke="#0C0A09"/>
      </svg>  

      </Button>
    ),
    className: "w-12",
  },
]

export function TasksTable({ orderDetails }: TasksTableProps = {}) {
  // Transform task logs from order details into tasks
  const taskLogs = orderDetails?.taskLogs || []
  const tasks = transformTaskLogsToTasks(taskLogs)
  
  // Create empty state component
  const emptyState = (
    <NoData 
      title="No tasks found"
      description="No tasks have been created for this order yet."
      icon={<NoDataIcons.tasks />}
    />
  );
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
        </div>
        <DataTable 
          data={tasks} 
          columns={columns} 
          emptyState={emptyState}
        />
      </div>
    </Card>
  )
}
