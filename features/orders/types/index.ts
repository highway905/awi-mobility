export interface Order {
  transactionId: string
  customer: string
  orderType: string
  referenceId: string
  channel: string
  appointmentDate: string
  status: string
}

export interface OrderFilters {
  tab: "all" | "inbound" | "outbound"
  search: string
  dateRange: {
    from: string
    to: string
  }
}
