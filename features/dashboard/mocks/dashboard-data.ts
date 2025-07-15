import type { OrderStatus, Task, AttentionItem } from "../types"

export const outboundOrderData: OrderStatus[] = [
  { title: "Open Orders", value: 120, variant: "gray" },
  { title: "Missing BOL", value: 4, variant: "yellow" },
  { title: "Carrier Unassigned", value: 2, variant: "purple" },
  { title: "OB QC Pending", value: 251, variant: "orange" },
  { title: "Completed", value: "40%", variant: "green" },
]

export const inboundOrderData: OrderStatus[] = [
  { title: "Open Orders", value: 12, variant: "gray" },
  { title: "Missing BOL", value: 6, variant: "yellow" },
  { title: "Carrier Unassigned", value: 20, variant: "purple" },
  { title: "OB QC Pending", value: 231, variant: "orange" },
  { title: "Completed", value: "47%", variant: "green" },
]

export const currentTasksData: Task[] = [
  {
    employee: "Ethan Walker",
    transactionId: "I-0007263",
    task: "Move inventory to B2C Shelf",
    timeElapsed: "60m",
  },
  {
    employee: "Emma Brown",
    transactionId: "TO-0695248",
    task: "Picking",
    timeElapsed: "15m",
  },
  {
    employee: "Ava Wilson",
    transactionId: "TO-0695247",
    task: "Packing",
    timeElapsed: "45m",
  },
  {
    employee: "Noah Davis",
    transactionId: "O-0695243",
    task: "Assign Carrier Labeling",
    timeElapsed: "10m",
  },
  {
    employee: "Isabella Lee",
    transactionId: "O-0695243",
    task: "Loading",
    timeElapsed: "30m",
  },
]

export const needsAttentionData: AttentionItem[] = [
  {
    transactionId: "I-0007263",
    orderType: "B2B",
    task: "Picking",
    assignedTo: "Olivia Brown",
    status: "Paused",
    issue: "Threshold Breach",
    details: "Picking delayed...",
  },
  {
    transactionId: "TO-0695248",
    orderType: "B2B Returns",
    task: "Unloading",
    assignedTo: "James Anderson",
    status: "Yet to Start",
    issue: "Past Appointment",
    details: "3 hours past ap...",
  },
  {
    transactionId: "TO-0695247",
    orderType: "B2C",
    task: "Unloading",
    assignedTo: "Sophia Martinez",
    status: "Unloading",
    issue: "Threshold Breach",
    details: "Delayed by 1m",
  },
]

export const statusStyles = {
  Paused: "bg-yellow-100 text-yellow-800",
  "Yet to Start": "bg-blue-100 text-blue-800",
  Unloading: "bg-orange-100 text-orange-800",
  "In Progress": "bg-green-100 text-green-800",
  "On Hold": "bg-red-100 text-red-800",
}
