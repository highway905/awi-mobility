import type { LogEntry } from "../types"

export const orderLogs: LogEntry[] = [
  {
    id: "1",
    action: "Shipment Created",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "2",
    action: "Picking Completed",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "3",
    action: "Order Packing",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "4",
    action: "Order Picking",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "5",
    action: "Order status has been updated to Ready to Process",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
]

export const taskLogs: LogEntry[] = [
  {
    id: "1",
    action: "Picking - Started",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "2",
    action: "Picking - Paused",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "3",
    action: "Picking - Started",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "4",
    action: "Move inventory to B2C Shelf - Completed",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "5",
    action: "Move inventory to B2C Shelf - Started",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
]
