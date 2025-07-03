"use client"

import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { pricingData, totalAmount } from "../mocks/pricing-data"
import type { PricingItem } from "../types"

const columns: DataTableColumn<PricingItem>[] = [
  {
    key: "description",
    header: "Description",
    headerClassName: "text-gray-500",
    className: "font-medium",
  },
  {
    key: "qty",
    header: "Qty",
    headerClassName: "text-gray-500",
  },
  {
    key: "rate",
    header: "Rate",
    headerClassName: "text-gray-500",
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    key: "total",
    header: "Total",
    headerClassName: "text-gray-500",
    render: (value: number) => `$${value.toFixed(2)}`,
  },
]

export function PricingTable() {
  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-xl font-semibold mb-6">Pricing</h2>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1">
          <DataTable data={pricingData} columns={columns} />
        </div>

        {/* Total Row */}
        <div className="mt-6 pt-4 border-t border-dashboard-border">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
