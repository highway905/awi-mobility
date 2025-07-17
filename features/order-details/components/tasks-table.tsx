"use client"

import { TaskTable, type TaskItem } from "@/features/shared/components/task-table"
import type { OrderDetailsResponse, TaskLog } from "../types/order-details.types"

interface TasksTableProps {
  orderDetails?: OrderDetailsResponse;
}

// Transform task logs from order details into tasks
const transformTaskLogsToTasks = (taskLogs: TaskLog[]): TaskItem[] => {
  return taskLogs.map((log, index) => ({
    id: log.id || `task-${index}`,
    task: log.taskDetails || 'Unknown Task',
    assignedTo: log.user || null,
    priority: "Medium" as const, // Default priority since not in API
    status: (log.taskStatus as any) || "Waiting" as const
  }))
}

export function TasksTable({ orderDetails }: TasksTableProps = {}) {
  // Transform task logs from order details into tasks
  const taskLogs = orderDetails?.taskLogs || []
  const tasks = transformTaskLogsToTasks(taskLogs)
  
  const handleCreateTask = () => {
    // Handle task creation
    alert("Create task functionality would be implemented here")
  }

  const handleTaskAction = (taskId: string) => {
    // Handle task action (e.g., view/edit task)
    console.log("Task action for:", taskId)
  }
  
  return (
    <TaskTable 
      tasks={tasks}
      onCreateTask={handleCreateTask}
      onTaskAction={handleTaskAction}
      emptyStateTitle="No Tasks"
      emptyStateDescription="No tasks have been added to this order."
    />
  )
}
