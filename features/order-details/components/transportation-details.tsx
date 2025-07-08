"use client"

import { Card } from "@/components/ui/card"

interface HandlingDetails {
  id: string;
  transportationArrangementName: string;
  transportationArrangementId: string;
  transportationMethodName: string;
  transportationMethodId: string;
  trailerTypeName: string;
  trailerTypeId: string;
}

interface TransportationSchedule {
  id: string;
  departureOrigin: string;
  containerETA: string;
  containerATA: string;
}

interface CarrierDetails {
  id: string;
  carrier: string;
  carrierId: string;
  serviceType: string;
  serviceTypeId: string;
}

interface TransportationDetailsProps {
  handlingDetails: HandlingDetails;
  transportationSchedule: TransportationSchedule;
  carrierDetails: CarrierDetails;
}

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

export function TransportationDetails({ 
  handlingDetails, 
  transportationSchedule, 
  carrierDetails 
}: TransportationDetailsProps) {
  return (
    <Card>
      <div className="p-6 space-y-8">
        {/* Handling Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Handling Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Transportation Arrangement</label>
              <div className="font-medium">{handlingDetails.transportationArrangementName}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Transportation Method</label>
              <div className="font-medium">{handlingDetails.transportationMethodName}</div>
            </div>
            {handlingDetails.trailerTypeName && (
              <div>
                <label className="text-sm text-gray-500">Trailer Type</label>
                <div className="font-medium">{handlingDetails.trailerTypeName}</div>
              </div>
            )}
          </div>
        </div>

        {/* Carrier Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Carrier Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-500">Carrier</label>
              <div className="font-medium">{carrierDetails.carrier}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Service Type</label>
              <div className="font-medium">{carrierDetails.serviceType}</div>
            </div>
          </div>
        </div>

        {/* Transportation Schedule */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Transportation Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-500">Departure Origin</label>
              <div className="font-medium">{formatDate(transportationSchedule.departureOrigin)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Container ETA</label>
              <div className="font-medium">{formatDate(transportationSchedule.containerETA)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Container ATA</label>
              <div className="font-medium">{formatDate(transportationSchedule.containerATA)}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
