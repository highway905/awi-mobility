"use client"

import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { shippingData, trackingEvents } from "../mocks/shipping-data"
import type { TrackingEvent } from "../types"

const columns: DataTableColumn<TrackingEvent>[] = [
  {
    key: "date",
    header: "Date",
    headerClassName: "text-gray-500",
  },
  {
    key: "time",
    header: "Time",
    headerClassName: "text-gray-500",
  },
  {
    key: "location",
    header: "Location",
    headerClassName: "text-gray-500",
  },
  {
    key: "status",
    header: "Status",
    headerClassName: "text-gray-500",
  },
  {
    key: "description",
    header: "Description",
    headerClassName: "text-gray-500",
  },
]

export function ShippingTracking() {
  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-xl font-semibold mb-6">Shipping & Tracking</h2>

      {/* Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="text-sm text-gray-500">Carrier</label>
          <div className="font-medium">{shippingData.carrier}</div>
        </div>
        <div>
          <label className="text-sm text-gray-500">Tracking Number</label>
          <div className="font-medium">{shippingData.trackingNumber}</div>
        </div>
        <div>
          <label className="text-sm text-gray-500">Transit Time</label>
          <div className="font-medium">{shippingData.transitTime}</div>
        </div>
      </div>

      {/* Tracking Table */}
      <div className="flex-1 min-h-0">
        {trackingEvents.length > 0 ? (
          <DataTable data={trackingEvents} columns={columns} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border border-dashboard-border rounded-dashboard">
            <div className="mb-4">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-gray-300">
                <rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
                <rect x="16" y="24" width="8" height="2" fill="currentColor" />
                <rect x="16" y="28" width="12" height="2" fill="currentColor" />
                <rect x="16" y="32" width="6" height="2" fill="currentColor" />
                <rect x="32" y="24" width="8" height="2" fill="currentColor" />
                <rect x="32" y="28" width="12" height="2" fill="currentColor" />
                <rect x="32" y="32" width="6" height="2" fill="currentColor" />
              </svg>
            </div>
            <div className="text-lg font-medium">No Data</div>
          </div>
        )}
      </div>
    </div>
  )
}
