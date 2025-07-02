import type { InventoryDetails } from "../types"

interface CustomerDetailsCardProps {
  details: InventoryDetails
}

export function CustomerDetailsCard({ details }: CustomerDetailsCardProps) {
  return (
    <div className="border border-dashboard-border bg-white rounded-dashboard p-4">
      <div className="grid grid-cols-4 gap-x-8 gap-y-2 h-full">
        {/* First Row */}
        <div>
          <div className="text-sm text-gray-500 mb-1">Customer</div>
          <div className="font-medium text-gray-900">{details.customer}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Warehouse</div>
          <div className="font-medium text-gray-900">{details.warehouse}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">SKU</div>
          <div className="font-medium text-gray-900">{details.skuNumber}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Lot#</div>
          <div className="font-medium text-gray-900">{details.lotNumber}</div>
        </div>

        {/* Second Row */}
        <div>
          <div className="text-sm text-gray-500 mb-1">Expiration Date</div>
          <div className="font-medium text-gray-900">{details.expirationDate}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Pallet ID</div>
          <div className="font-medium text-gray-900">{details.palletId}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Location</div>
          <div className="font-medium text-gray-900">{details.location}</div>
        </div>

        <div>{/* Empty cell for layout */}</div>
      </div>
    </div>
  )
}
