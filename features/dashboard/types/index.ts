export interface OrderStatus {
  title: string
  value: string | number
  variant: "gray" | "yellow" | "purple" | "orange" | "green"
}

export interface Task {
  employee: string
  transactionId: string
  task: string
  timeElapsed: string
}

export interface AttentionItem {
  transactionId: string
  orderType: string
  task: string
  assignedTo: string
  status: string
  issue: string
  details: string
}

export interface ChartData {
  name: string
  value: number
  color: string
}

export interface DashboardFilters {
  dateRange: string
  status: string
  department: string
}
