import type { TransportationDetails } from "../types"

export const transportationData: TransportationDetails = {
  handlingDetails: {
    transportationArrangement: "ABI",
    transportationMethod: "Parcel",
  },
  carrierDetails: {
    shippingMethod: "Parcel-blue diamond",
    carrier: "FedEx",
    serviceType: "2 Day",
  },
  pickUpDetails: {
    trackingNumber: "794819750728",
    loadNumber: "-",
    doorNumber: "-",
  },
  pickUpAppointment: {
    estPickupDate: "2/18/2025",
    estPickupTime: "12:30 AM - 12:30 AM",
  },
  transportationSchedule: {
    needByShipDate: "2/13/2025",
    warehouseInstructions: "-",
    carrierInstructions: "-",
  },
  instructions: {
    warehouseInstructions: "-",
    carrierInstructions: "-",
  },
}
