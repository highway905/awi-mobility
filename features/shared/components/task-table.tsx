"use client"

import { Button } from "@/components/ui/button"
import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { Plus, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Task {
  id: string
  task: string
  assignedTo: string | null
  priority: "Low" | "Medium" | "High"
  status: "In Progress" | "Paused" | "On Hold" | "Yet to Start" | "Waiting" | "Started" | "Completed"
}

interface TaskTableProps {
  tasks: Task[]
  showActions?: boolean
  onCreateTask?: () => void
  onTaskAction?: (taskId: string) => void
  emptyStateTitle?: string
  emptyStateDescription?: string
  className?: string
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

export function TaskTable({ 
  tasks = [],
  showActions = true,
  onCreateTask,
  onTaskAction,
  emptyStateTitle = "No Tasks",
  emptyStateDescription = "No tasks have been added to this order.",
  className
}: TaskTableProps) {
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
  ]

  // Add actions column if showActions is true
  if (showActions) {
    columns.push({
      key: "id",
      header: "",
      render: (_, task) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-gray-100"
          onClick={() => onTaskAction?.(task.id)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1.4353C11.6253 1.43535 14.5645 4.3744 14.5645 7.99976C14.5644 11.6251 11.6253 14.5642 8 14.5642C4.37465 14.5642 1.4356 11.6251 1.43555 7.99976C1.43555 4.37437 4.37461 1.4353 8 1.4353ZM8 1.44897C4.38197 1.44897 1.44922 4.38174 1.44922 7.99976C1.44927 11.6177 4.382 14.5505 8 14.5505C11.6179 14.5505 14.5507 11.6177 14.5508 7.99976C14.5508 4.38177 11.618 1.44903 8 1.44897ZM8 4.76636C8.01828 4.76636 8.03299 4.78133 8.0332 4.79956V7.96655H11.2002C11.2185 7.96666 11.2333 7.98146 11.2334 7.99976C11.2334 8.01814 11.2185 8.03285 11.2002 8.03296H8.0332V11.2C8.0332 11.2183 8.01838 11.2332 8 11.2332C7.98163 11.2331 7.9668 11.2183 7.9668 11.2V8.03296H4.7998C4.7815 8.03284 4.7666 8.01809 4.7666 7.99976C4.76671 7.98151 4.78157 7.96667 4.7998 7.96655H7.9668V4.79956C7.96701 4.78134 7.98174 4.76637 8 4.76636Z" fill="#0C0A09" stroke="#0C0A09"/>
          </svg>  
        </Button>
      ),
      className: "w-12",
    })
  }

  // Custom empty state component to match the design
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyStateTitle}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">{emptyStateDescription}</p>
      {onCreateTask && (
        <Button 
          onClick={onCreateTask}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6"
        >
          Create Task
        </Button>
      )}
    </div>
  )

  return (
    <div className={className}>
      <DataTable 
        data={tasks} 
        columns={columns} 
        emptyState={emptyState}
      />
    </div>
  )
}

// Export the Task type for use in other components
export type { Task as TaskItem }
