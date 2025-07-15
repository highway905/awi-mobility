import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { currentTasksData } from "../mocks/dashboard-data"
import type { Task } from "../types"

const columns: DataTableColumn<Task>[] = [
  {
    key: "employee",
    header: "Employee",
    className: "font-medium",
  },
  {
    key: "transactionId",
    header: "Transaction ID",
  },
  {
    key: "task",
    header: "Task",
  },
  {
    key: "timeElapsed",
    header: "Time Elapsed",
  },
]

export function CurrentTasksTable() {
  return (
    <Card className="h-table-section">
      <CardHeader>
        <CardTitle>Current Tasks by Employee</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <DataTable data={currentTasksData} columns={columns} />
      </CardContent>
    </Card>
  )
}
