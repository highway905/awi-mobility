"use client"

import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { GlobalErrorFallback } from "@/components/shared"

interface TrackingDetails {
  shippingAndTracking: {
    carrier: string
    carrierService: string
    trackingNumber: string
    trackingUrl: string
  }
}

interface DeliveryDetails {
  id: string
  billOfLadingNumber: string
  trackingNumber: string
  trailerOrContainerNumber: string
  loadNumber: string
  sealNumber: string
  doorNumber: string
}

// Interface for the tracking events display
interface TrackingEvent {
  id: string
  date: string
  time: string
  location: string
  status: string
  description: string
}

interface ShippingTrackingProps {
  trackingDetails: TrackingDetails
  deliveryDetails: DeliveryDetails
}

// Sample tracking events (in a real app, this would come from an API)
const sampleTrackingEvents: TrackingEvent[] = [
  {
    id: "1",
    date: "Jul 5, 2025",
    time: "3:42 PM",
    location: "Los Angeles, CA",
    status: "Delivered",
    description: "Package delivered to recipient",
  },
  {
    id: "2",
    date: "Jul 4, 2025",
    time: "8:15 AM",
    location: "Los Angeles, CA",
    status: "Out for Delivery",
    description: "Package is out for delivery",
  },
  {
    id: "3",
    date: "Jul 3, 2025",
    time: "9:32 PM",
    location: "Los Angeles, CA",
    status: "Arrived at Destination",
    description: "Package has arrived at final destination",
  },
]

export function ShippingTracking({ trackingDetails, deliveryDetails }: ShippingTrackingProps) {
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
      className: "w-80",
    },
  ]

  // Create empty state component
  const emptyState = (
    <GlobalErrorFallback 
      variant="card"
      title="No tracking events"
      description="No tracking information is available for this shipment yet."
      showRetry={false}
    />
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
        <div>
          <label className="text-sm text-gray-500 block mb-1">Carrier</label>
          <div className="font-medium">{trackingDetails.shippingAndTracking.carrier}</div>
        </div>
        <div>
          <label className="text-sm text-gray-500 block mb-1">Carrier Service</label>
          <div className="font-medium">{trackingDetails.shippingAndTracking.carrierService}</div>
        </div>
        <div>
          <label className="text-sm text-gray-500 block mb-1">Tracking Number</label>
          <div className="font-medium">{deliveryDetails.trackingNumber}</div>
        </div>
        <div>
          <label className="text-sm text-gray-500 block mb-1">Bill of Lading</label>
          <div className="font-medium">{deliveryDetails.billOfLadingNumber || "-"}</div>
        </div>
        {deliveryDetails.trailerOrContainerNumber && (
          <div>
            <label className="text-sm text-gray-500 block mb-1">Trailer/Container Number</label>
            <div className="font-medium">{deliveryDetails.trailerOrContainerNumber}</div>
          </div>
        )}
        {deliveryDetails.loadNumber && (
          <div>
            <label className="text-sm text-gray-500 block mb-1">Load Number</label>
            <div className="font-medium">{deliveryDetails.loadNumber}</div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Tracking Events</h3>
        <DataTable 
          columns={columns} 
          data={sampleTrackingEvents} 
          emptyState={emptyState}
        />
      </div>
    </div>
  )
}
