import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { GlobalErrorFallback } from "@/components/shared"

interface PricingItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface PricingTableProps {
  orderDetails?: any
}

const columns: DataTableColumn<PricingItem>[] = [
  {
    key: "description",
    header: "Description",
  },
  {
    key: "quantity", 
    header: "Quantity",
  },
  {
    key: "unitPrice",
    header: "Unit Price",
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    key: "total",
    header: "Total",
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
    <GlobalErrorFallback 
      variant="card"
      title="No pricing information"
      description="No pricing details are available for this order."
      showRetry={false}
    />
  )
  
  return (
    <div className="space-y-4">
      <DataTable
        data={pricing}
        columns={columns}
        emptyState={emptyState}
        className="border rounded-lg"
      />
      
      {pricing.length > 0 && (
        <div className="flex justify-end">
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <span className="font-semibold">Total: ${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
