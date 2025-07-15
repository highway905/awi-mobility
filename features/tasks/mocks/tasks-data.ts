import type { Task } from "../types"
import type { TaskFilters } from "../types"

export const mockTasksData: Task[] = [
  {
    id: "1",
    transactionId: "I-0007263",
    orderType: "B2B",
    task: "Sorting",
    taskType: "sorting",
    assignedTo: "Ethan Walker",
    priority: "High",
    status: "In Progress",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T14:20:00Z",
  },
  {
    id: "2",
    transactionId: "TO-0695248",
    orderType: "B2B Returns",
    task: "Move inventory to B2C Shelf",
    taskType: "receiving-putaway",
    assignedTo: "Emma Brown",
    priority: "Low",
    status: "In Progress",
    createdAt: "2025-01-15T09:15:00Z",
    updatedAt: "2025-01-15T13:45:00Z",
  },
  {
    id: "3",
    transactionId: "TO-0695247",
    orderType: "B2C",
    task: "Unloading",
    taskType: "unloading",
    assignedTo: "Ava Wilson",
    priority: "High",
    status: "Waiting",
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T12:30:00Z",
  },
  {
    id: "4",
    transactionId: "O-0695243",
    orderType: "B2C",
    task: "IB Quality Assurance",
    taskType: "ibqa",
    assignedTo: "Olivia Johnson",
    priority: "Low",
    status: "Paused",
    createdAt: "2025-01-14T16:20:00Z",
    updatedAt: "2025-01-15T11:10:00Z",
  },
  {
    id: "5",
    transactionId: "I-0007264",
    orderType: "B2B Returns",
    task: "Review Overage / Underage",
    taskType: "review-overage",
    assignedTo: "Noah Davis",
    priority: "Medium",
    status: "Yet to Start",
    createdAt: "2025-01-14T14:45:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "6",
    transactionId: "TO-0695249",
    orderType: "B2C Returns",
    task: "Receiving and Putaway",
    taskType: "receiving-putaway",
    assignedTo: "Isabella Lee",
    priority: "Medium",
    status: "On Hold",
    createdAt: "2025-01-14T13:30:00Z",
    updatedAt: "2025-01-15T09:20:00Z",
  },
  {
    id: "7",
    transactionId: "TO-0695250",
    orderType: "B2B",
    task: "Unloading",
    taskType: "unloading",
    assignedTo: "Mason Rodriguez",
    priority: "Medium",
    status: "Completed",
    createdAt: "2025-01-14T11:15:00Z",
    updatedAt: "2025-01-15T08:45:00Z",
  },
  {
    id: "8",
    transactionId: "O-0695244",
    orderType: "B2C",
    task: "Picking",
    taskType: "picking",
    assignedTo: null,
    priority: "High",
    status: "Yet to Start",
    createdAt: "2025-01-14T10:00:00Z",
    updatedAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "9",
    transactionId: "-",
    orderType: "B2B Returns",
    task: "Cycle Count",
    taskType: "cycle-count",
    assignedTo: "Sophia Garcia",
    priority: "Medium",
    status: "Yet to Start",
    createdAt: "2025-01-14T09:30:00Z",
    updatedAt: "2025-01-15T07:30:00Z",
  },
  {
    id: "10",
    transactionId: "TO-0695251",
    orderType: "B2C Returns",
    task: "Stock Replenishment",
    taskType: "stock-replenishment",
    assignedTo: "Lucas Martinez",
    priority: "Low",
    status: "Paused",
    createdAt: "2025-01-14T08:15:00Z",
    updatedAt: "2025-01-15T07:00:00Z",
  },
]

export function getFilteredTasks(filters: TaskFilters): Task[] {
  return mockTasksData.filter((task) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (
        !task.transactionId.toLowerCase().includes(searchLower) &&
        !task.task.toLowerCase().includes(searchLower) &&
        !task.orderType.toLowerCase().includes(searchLower) &&
        !task.assignedTo?.toLowerCase().includes(searchLower)
      ) {
        return false
      }
    }

    // Assignment filter
    if (filters.assignmentFilter === "assigned-to-me") {
      return task.assignedTo !== null
    } else if (filters.assignmentFilter === "unassigned") {
      return task.assignedTo === null
    }

    // Include closed tasks
    if (!filters.includeClosed && task.status === "Completed") {
      return false
    }

    // Status filter
    if (filters.status && filters.status !== "all" && task.status !== filters.status) {
      return false
    }

    // Priority filter
    if (filters.priority && filters.priority !== "all" && task.priority !== filters.priority) {
      return false
    }

    // Order type filter
    if (filters.orderType && filters.orderType !== "all" && task.orderType !== filters.orderType) {
      return false
    }

    return true
  })
}

export function getTaskById(id: string): Task | null {
  return mockTasksData.find((task) => task.id === id) || null
}
