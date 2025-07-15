"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { DataTableColumn } from "@/features/shared/components/data-table"
import type { Task } from "../types"

interface TasksColumnCustomizationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: DataTableColumn<Task>[]
  onColumnsChange: (columns: DataTableColumn<Task>[]) => void
}

export function TasksColumnCustomizationSheet({
  open,
  onOpenChange,
  columns,
  onColumnsChange,
}: TasksColumnCustomizationSheetProps) {
  const [localColumns, setLocalColumns] = useState(columns)

  const handleReset = () => {
    setLocalColumns(columns)
  }

  const handleSave = () => {
    onColumnsChange(localColumns)
    onOpenChange(false)
  }

  const toggleColumnVisibility = (key: string) => {
    setLocalColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col)))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Customize Columns</SheetTitle>
          <p className="text-sm text-gray-600">Drag to reorder columns and toggle visibility</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2">
            {localColumns.map((column) => (
              <div key={column.key} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                <span className="flex-1 text-sm font-medium">{column.header}</span>
                <Switch checked={column.visible !== false} onCheckedChange={() => toggleColumnVisibility(column.key)} />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t bg-white p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
