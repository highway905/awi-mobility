"use client"

import { Card } from "@/components/ui/card"

interface HandlingDetails {
  id?: string;
  transportationArrangementName?: string | null;
  transportationArrangementId?: string | null;
  transportationMethodName?: string | null;
  transportationMethodId?: string | null;
  trailerTypeName?: string | null;
  trailerTypeId?: string | null;
}

interface TransportationSchedule {
  id?: string;
  departureOrigin?: string | null;
  containerETA?: string | null;
  containerATA?: string | null;
  needByShipDate?: string | null;
  warehouseInstructions?: string | null;
  carrierInstructions?: string | null;
}

interface CarrierDetails {
  id?: string;
  carrier?: string | null;
  carrierId?: string | null;
  serviceType?: string | null;
  serviceTypeId?: string | null;
  shippingMethod?: string | null;
  scac?: string | null;
  accountNumber?: string | null;
  accountZipOrPostalCode?: string | null;
  billingType?: string | null;
  billingTypeId?: string | null;
  customCarrierName?: string | null;
  isCustomCarrier?: boolean | null;
  customServiceName?: string | null;
  isCustomCarrierService?: boolean | null;
  isIntegrated?: boolean | null;
  isComparedRateChoosed?: boolean | null;
  useShippingMethod?: boolean | null;
  orderShippingRateEstimateId?: string | null;
  isShippingMethod?: boolean | null;
  isInternational?: boolean | null;
  // Additional fields for pickup details
  trackingNumber?: string | null;
  loadNumber?: string | null;
  doorNumber?: string | null;
  estPickupDate?: string | null;
  estPickupTimeFrom?: string | null;
  estPickupTimeTo?: string | null;
}

interface TransportationDetailsProps {
  handlingDetails: HandlingDetails;
  transportationSchedule: TransportationSchedule;
  carrierDetails: CarrierDetails;
}

function formatDate(dateString: string): string {
  if (!dateString || dateString === 'null') return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return '-';
  }
}

function formatTime(timeString: string): string {
  if (!timeString || timeString === 'null') return '-';
  return timeString;
}

function safeValue(value: any): string {
  if (value === null || value === undefined || value === '' || value === 'null') {
    return '-';
  }
  return String(value);
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
              <div className="font-medium">{safeValue(handlingDetails?.transportationArrangementName)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Transportation Method</label>
              <div className="font-medium">{safeValue(handlingDetails?.transportationMethodName)}</div>
            </div>
          </div>
        </div>

        {/* Carrier Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Carrier Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-500">Shipping Method</label>
              <div className="font-medium">{safeValue(carrierDetails?.shippingMethod)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Carrier</label>
              <div className="font-medium">{safeValue(carrierDetails?.carrier)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Service Type</label>
              <div className="font-medium">{safeValue(carrierDetails?.serviceType)}</div>
            </div>
          </div>
        </div>

        {/* Pick Up Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Pick Up Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-500">Tracking Number</label>
              <div className="font-medium">{safeValue(carrierDetails?.trackingNumber)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Load Number</label>
              <div className="font-medium">{safeValue(carrierDetails?.loadNumber)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Door Number</label>
              <div className="font-medium">{safeValue(carrierDetails?.doorNumber)}</div>
            </div>
          </div>
        </div>

        {/* Pick Up Appointment */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Pick Up Appointment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Est. Pickup Date to Warehouse</label>
              <div className="font-medium">{formatDate(carrierDetails?.estPickupDate || '')}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Est. Pickup Time From & To Warehouse</label>
              <div className="font-medium">{
                safeValue(carrierDetails?.estPickupTimeFrom) !== '-' || safeValue(carrierDetails?.estPickupTimeTo) !== '-' 
                  ? `${safeValue(carrierDetails?.estPickupTimeFrom)} - ${safeValue(carrierDetails?.estPickupTimeTo)}`
                  : '-'
              }</div>
            </div>
          </div>
        </div>

        {/* Transportation Schedule */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Transportation Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-500">Need by Ship Date</label>
              <div className="font-medium">{formatDate(transportationSchedule?.needByShipDate || '')}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Warehouse Instructions</label>
              <div className="font-medium">{safeValue(transportationSchedule?.warehouseInstructions)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Carrier Instructions</label>
              <div className="font-medium">{safeValue(transportationSchedule?.carrierInstructions)}</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Warehouse Instructions</label>
              <div className="font-medium">{safeValue(transportationSchedule?.warehouseInstructions)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Carrier Instructions</label>
              <div className="font-medium">{safeValue(transportationSchedule?.carrierInstructions)}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
