export interface InventoryItem {
  id: string
  sku: string
  warehouse: string
  location: string
  palletId: string
  inbound: number
  outbound: number
  adjustment: number
  onHand: number
  available?: number
  onHold?: number
}

export interface InventoryTotals {
  inbound: number
  outbound: number
  adjustment: number
  onHand: number
  available?: number
  onHold?: number
}

export interface InventoryFilters {
  customer: string
  search: string
}

export interface InventoryDetails {
  sku: string
  name: string
  customer: string
  warehouse: string
  skuNumber: string
  lotNumber: string
  expirationDate: string
  palletId: string
  location: string
}

export interface TransactionHistory {
  id: string
  dateTime: string
  type: string
  transactionId: string
  referenceId: string
  location: string
  inbound: number
  outbound: number
  adjustment: number
}
