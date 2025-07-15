import type { WarehouseItem } from "../types"

export const warehouseItems: WarehouseItem[] = [
  {
    id: "1",
    sku: "5615514",
    name: "T-shirt",
    primaryUPC: "upc7",
    lotNumber: "S2654654",
    expirationDate: "12/26/2026",
    orderQty: 1,
    actualQty: 1,
    details: {
      palletId: "P0138006",
      cartonsOnPallet: 0,
      pallet: "-",
      location: "10-A10",
    },
  },
  {
    id: "2",
    sku: "5646134",
    name: "Shirt",
    primaryUPC: "bf65",
    lotNumber: "G6451349",
    expirationDate: "12/26/2026",
    orderQty: 1,
    actualQty: 1,
  },
  {
    id: "3",
    sku: "8945636",
    name: "Blended Shirt",
    primaryUPC: "eg489",
    lotNumber: "G7894634",
    expirationDate: "12/26/2026",
    orderQty: 1,
    actualQty: 1,
  },
]
