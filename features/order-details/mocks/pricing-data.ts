import type { PricingItem } from "../types"

export const pricingData: PricingItem[] = [
  {
    id: "1",
    description: "B2C Outbound Processing",
    qty: 1,
    rate: 0,
    total: 0,
  },
  {
    id: "2",
    description: "Transportation",
    qty: 1,
    rate: 142.54,
    total: 142.54,
  },
  {
    id: "3",
    description: "Box Fees ( Muthu Sample box )",
    qty: 1,
    rate: 100,
    total: 100,
  },
]

export const totalAmount = pricingData.reduce((sum, item) => sum + item.total, 0)
