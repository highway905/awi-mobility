export interface Task {
  id: string
  transactionId: string
  orderType: string
  task: string
  taskType:
    | "unloading"
    | "ibqa"
    | "receiving-putaway"
    | "sorting"
    | "ib-qa"
    | "review-overage"
    | "picking"
    | "cycle-count"
    | "stock-replenishment"
  assignedTo: string | null
  priority: "High" | "Medium" | "Low"
  status: "In Progress" | "Waiting" | "Paused" | "Yet to Start" | "Completed" | "On Hold"
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  search: string
  assignmentFilter: "all" | "assigned-to-me" | "unassigned"
  includeClosed: boolean
  status: string
  priority: string
  orderType: string
}

export interface TasksPageProps {
  tasks: Task[]
  totalCount: number
}

export interface TaskExecutionTab {
  id: string
  label: string
}

export interface UnloadingItem {
  id: string
  sku: string
  description: string
  expectedQty: number
  receivedQty: number
  status: "pending" | "completed" | "discrepancy"
}

export interface LogEntry {
  id: string
  action: string
  author: string
  user: string
  timestamp: string
}
