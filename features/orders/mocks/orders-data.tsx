"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

export interface Order {
  transactionId: string
  customer: string
  orderType: string
  referenceId: string
  channel: string
  appointmentDate: string
  status: string
}

const statusStyles = {
  Initialized: "bg-blue-100 text-blue-800",
  "Ready to Process": "bg-purple-100 text-purple-800",
  Unloading: "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
  Receiving: "bg-yellow-100 text-yellow-800",
  Putaway: "bg-indigo-100 text-indigo-800",
  Completed: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-800",
}

const columnHelper = createColumnHelper<Order>()

export const ordersColumns = [
  columnHelper.accessor("transactionId", {
    header: "Transaction ID",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor("customer", {
    header: "Customer",
    enableSorting: true,
  }),
  columnHelper.accessor("orderType", {
    header: "Order Type",
    enableSorting: true,
  }),
  columnHelper.accessor("referenceId", {
    header: "Reference ID",
    enableSorting: true,
  }),
  columnHelper.accessor("channel", {
    header: "Channel",
    enableSorting: true,
  }),
  columnHelper.accessor("appointmentDate", {
    header: "Appointment Date",
    enableSorting: true,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          statusStyles[info.getValue() as keyof typeof statusStyles],
        )}
      >
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
]

export const allOrdersData: Order[] = [
  {
    transactionId: "I-0007263",
    customer: "Vertex Holdings",
    orderType: "B2B",
    referenceId: "ref24680",
    channel: "EDI",
    appointmentDate: "02/20/2025",
    status: "Initialized",
  },
  {
    transactionId: "TO-0695248",
    customer: "Synergy Systems",
    orderType: "B2B Returns",
    referenceId: "demo-5d-e6f-007",
    channel: "Manual",
    appointmentDate: "01/10/2025",
    status: "Initialized",
  },
  {
    transactionId: "TO-0695247",
    customer: "NexGen Industries",
    orderType: "B2C",
    referenceId: "ref98765",
    channel: "Shopify",
    appointmentDate: "04/01/2025",
    status: "Ready to Process",
  },
  {
    transactionId: "O-0695243",
    customer: "Apex Solutions",
    orderType: "B2C",
    referenceId: "o-ref6789",
    channel: "EDI",
    appointmentDate: "01/28/2025",
    status: "Unloading",
  },
  {
    transactionId: "O-0695243",
    customer: "Summit Technologies",
    orderType: "B2B Returns",
    referenceId: "o-ref1234",
    channel: "Manual",
    appointmentDate: "03/12/2025",
    status: "Delivered",
  },
  {
    transactionId: "O-0695243",
    customer: "FutureWave Technologies",
    orderType: "B2C Returns",
    referenceId: "demo-3j-k4l-012",
    channel: "EDI",
    appointmentDate: "02/05/2025",
    status: "Receiving",
  },
  {
    transactionId: "O-0695243",
    customer: "TechNova Solutions",
    orderType: "B2B",
    referenceId: "ref54321",
    channel: "Shopify",
    appointmentDate: "03/18/2025",
    status: "Putaway",
  },
  {
    transactionId: "O-0695243",
    customer: "Global Innovations Ltd",
    orderType: "B2C",
    referenceId: "o-ref1357",
    channel: "EDI",
    appointmentDate: "03/30/2025",
    status: "Completed",
  },
  {
    transactionId: "O-0695243",
    customer: "Quantum Dynamics",
    orderType: "B2B Returns",
    referenceId: "demo-8g-h9i-010",
    channel: "Shopify",
    appointmentDate: "03/25/2025",
    status: "Closed",
  },
]

export const inboundOrdersData: Order[] = allOrdersData.filter((order) =>
  ["B2B Returns", "B2C Returns"].includes(order.orderType),
)

export const outboundOrdersData: Order[] = allOrdersData.filter((order) => ["B2B", "B2C"].includes(order.orderType))
