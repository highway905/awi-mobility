import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface DataTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  className?: string
}

export function DataTable<T>({ data, columns, className }: DataTableProps<T>) {
  const getValue = (row: T, key: keyof T | string): any => {
    if (typeof key === "string" && key.includes(".")) {
      // Handle nested properties like 'user.name'
      return key.split(".").reduce((obj: any, k) => obj?.[k], row)
    }
    return row[key as keyof T]
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="h-10">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn("h-10 px-3 text-left align-middle font-medium text-gray-500", column.headerClassName)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="h-12 border-b border-dashboard-border hover:bg-gray-50/50">
              {columns.map((column, colIndex) => {
                const value = getValue(row, column.key)
                return (
                  <TableCell key={colIndex} className={cn("h-12 px-3 align-middle", column.className)}>
                    {column.render ? column.render(value, row) : value}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
