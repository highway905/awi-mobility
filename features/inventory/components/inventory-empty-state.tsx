import { FileSpreadsheet } from "lucide-react"

export function InventoryEmptyState() {
  return (
    <div className="rounded-md border bg-white">
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <FileSpreadsheet className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Select a customer from the dropdown to view inventory data.
        </p>
      </div>
    </div>
  )
}
