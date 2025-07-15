"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface ColumnConfig {
  id: string
  label: string
  visible: boolean
  order: number
}

interface InventoryColumnCustomizationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InventoryColumnCustomizationSheet({ open, onOpenChange }: InventoryColumnCustomizationSheetProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "sku", label: "SKU", visible: true, order: 0 },
    { id: "warehouse", label: "Warehouse", visible: true, order: 1 },
    { id: "location", label: "Location", visible: true, order: 2 },
    { id: "palletId", label: "Pallet ID", visible: true, order: 3 },
    { id: "inbound", label: "Inbound", visible: true, order: 4 },
    { id: "outbound", label: "Outbound", visible: true, order: 5 },
    { id: "adjustment", label: "Adjustment", visible: true, order: 6 },
    { id: "onHand", label: "On Hand", visible: true, order: 7 },
    { id: "actions", label: "Actions", visible: true, order: 8 },
  ])

  const handleToggleColumn = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, visible: !col.visible } : col)))
  }

  const handleReset = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })))
  }

  const handleSave = () => {
    // Apply column configuration
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Customize Columns</SheetTitle>
          <SheetDescription>Drag to reorder columns and toggle visibility</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-4">
            {columns
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <div key={column.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                    <span className="font-medium">{column.label}</span>
                  </div>
                  <Switch checked={column.visible} onCheckedChange={() => handleToggleColumn(column.id)} />
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t bg-white">
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
      </SheetContent>
    </Sheet>
  )
}
