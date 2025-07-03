"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { Search, Camera } from "lucide-react"
import { pickingData } from "../mocks/picking-data"
import type { PickingItem } from "../types"

const columns: DataTableColumn<PickingItem>[] = [
  {
    key: "sku",
    header: "SKU",
    headerClassName: "text-gray-500",
  },
  {
    key: "name",
    header: "Name",
    headerClassName: "text-gray-500",
  },
  {
    key: "description",
    header: "Description",
    headerClassName: "text-gray-500",
  },
  {
    key: "primaryUPC",
    header: "Primary UPC",
    headerClassName: "text-gray-500",
  },
  {
    key: "bundleSKU",
    header: "Bundle SKU",
    headerClassName: "text-gray-500",
  },
  {
    key: "itemsBundle",
    header: "Items / Bundle",
    headerClassName: "text-gray-500",
  },
  {
    key: "orderQty",
    header: "Order Qty",
    headerClassName: "text-gray-500",
  },
  {
    key: "packedQty",
    header: "Packed Qty",
    headerClassName: "text-gray-500",
  },
]

export function PickingPacking() {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Picking & Packing</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="SKU, Name, UPC" className="pl-9 pr-12 w-80" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable data={pickingData} columns={columns} />
      </div>
    </div>
  )
}
