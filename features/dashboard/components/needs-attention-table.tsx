import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { cn } from "@/lib/utils"
import { needsAttentionData, statusStyles } from "../mocks/dashboard-data"
import type { AttentionItem } from "../types"

const columns: DataTableColumn<AttentionItem>[] = [
  {
    key: "transactionId",
    header: "Transaction ID",
    className: "font-medium",
  },
  {
    key: "orderType",
    header: "Order Type",
  },
  {
    key: "task",
    header: "Task",
  },
  {
    key: "assignedTo",
    header: "Assigned To",
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
    key: "issue",
    header: "Issue",
  },
  {
    key: "details",
    header: "Details",
  },
]

export function NeedsAttentionTable() {
  return (
    <Card className="h-table-section">
      <CardHeader>
        <CardTitle>Needs Attention</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <DataTable data={needsAttentionData} columns={columns} />
      </CardContent>
    </Card>
  )
}
