"use client"

import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { TableRow, TableCell } from "@/components/ui/table"
import { NoData, NoDataIcons } from "./no-data"
import type { PricingItem } from "../types"
import type { OrderDetailsResponse } from "../types/order-details.types"

interface PricingTableProps {
  orderDetails?: OrderDetailsResponse;
}

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

export function PricingTable({ orderDetails }: PricingTableProps = {}) {
  // Pricing data would typically come from a separate API endpoint
  // For now, show empty state since pricing is not included in basic order details
  const pricing: PricingItem[] = []
  const totalAmount = pricing.reduce((sum, item) => sum + item.total, 0)
  
  // Create empty state component
  const emptyState = (
    <NoData 
      title="No pricing information"
      description="No pricing details have been added for this order yet."
      icon={<NoDataIcons.pricing />}
    />
  );
  
  const tableFooter = (
    <TableRow className="border-none h-10">
      <TableCell colSpan={3} className="text-start font-semibold text-lg  border-none">
        Total
      </TableCell>
      <TableCell className="text-start font-semibold text-lg py-4 px-3 border-none">
        ${totalAmount.toFixed(2)}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="h-full flex flex-col p-2">
      {/* <h2 className="text-xl font-semibold mb-6">Pricing</h2> */}

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1">
          <DataTable 
            data={pricing} 
            columns={columns} 
            footer={tableFooter}
            emptyState={emptyState}
          />
        </div>
      </div>
    </div>
  )
}
