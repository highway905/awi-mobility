// Export new comprehensive types
export * from './order-details.types'

// Legacy types for backward compatibility
export interface Task {
  id: string
  task: string
  assignedTo: string | null
  priority: "High" | "Medium" | "Low"
  status: "In Progress" | "Paused" | "On Hold" | "Yet to Start" | "Waiting"
}

export interface Attachment {
  id: string
  documentName: string
  category: string
  fileSize?: string
  uploadDate?: string
}

export interface TransportationDetails {
  handlingDetails: {
    transportationArrangement: string
    transportationMethod: string
  }
  carrierDetails: {
    shippingMethod: string
    carrier: string
    serviceType: string
  }
  pickUpDetails: {
    trackingNumber: string
    loadNumber: string
    doorNumber: string
  }
  pickUpAppointment: {
    estPickupDate: string
    estPickupTime: string
  }
  transportationSchedule: {
    needByShipDate: string
    warehouseInstructions: string
    carrierInstructions: string
  }
  instructions: {
    warehouseInstructions: string
    carrierInstructions: string
  }
}

export interface ShippingTracking {
  carrier: string
  trackingNumber: string
  transitTime: string
}

export interface TrackingEvent {
  id: string
  date: string
  time: string
  location: string
  status: string
  description: string
}

export interface PickingItem {
  id: string
  sku: string
  name: string
  description: string
  primaryUPC: string
  bundleSKU: string
  itemsBundle: string
  orderQty: number
  packedQty: number
}

export interface PricingItem {
  id: string
  description: string
  qty: number
  rate: number
  total: number
}

export interface LogEntry {
  id: string
  action: string
  user: string
  timestamp: string
}

export interface WarehouseItem {
  id: string
  sku: string
  name: string
  primaryUPC: string
  lotNumber: string
  expirationDate: string
  orderQty: number
  actualQty: number
  details?: {
    palletId: string
    cartonsOnPallet: number
    pallet: string
    location: string
  }
}
