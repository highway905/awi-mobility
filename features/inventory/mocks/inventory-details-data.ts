import type { InventoryDetails, TransactionHistory } from "../types"

export const mockInventoryDetails: Record<string, InventoryDetails> = {
  "sku-yza2233": {
    sku: "D10-BLU-8-41",
    name: "Desk Lamp",
    customer: "Blue Flag",
    warehouse: "AWI-LA",
    skuNumber: "123",
    lotNumber: "-",
    expirationDate: "1/5/2025",
    palletId: "P0151151",
    location: "B2C Shelf (Temp.)",
  },
  "sku-bcd4455": {
    sku: "T-SHIRT-001",
    name: "T-Shirt",
    customer: "Blue Flag",
    warehouse: "ABISEC",
    skuNumber: "456",
    lotNumber: "L001",
    expirationDate: "12/31/2025",
    palletId: "P0143788",
    location: "CAS B2C SHELF",
  },
}

export const mockTransactionHistory: Record<string, TransactionHistory[]> = {
  "sku-yza2233": [
    {
      dateTime: "4/11/2025 12:44 PM",
      type: "Outbound Out",
      transactionId: "I-0007263",
      referenceId: "ref24680",
      location: "10-A1",
      inbound: 159,
      outbound: 88,
      adjustment: 0,
    },
    {
      dateTime: "4/11/2025 12:13 PM",
      type: "Unreserved",
      transactionId: "TO-0695248",
      referenceId: "demo-5d-e6f-007",
      location: "13-F34",
      inbound: 132,
      outbound: 37,
      adjustment: 0,
    },
    {
      dateTime: "4/10/2025 9:30 AM",
      type: "Reserved",
      transactionId: "TO-0695247",
      referenceId: "ref98765",
      location: "SEC B2C SHELF",
      inbound: 121,
      outbound: 45,
      adjustment: 0,
    },
    {
      dateTime: "4/10/2025 10:15 AM",
      type: "Reserved",
      transactionId: "O-0695243",
      referenceId: "o-ref6789",
      location: "22-D7",
      inbound: 148,
      outbound: 29,
      adjustment: 0,
    },
    {
      dateTime: "4/9/2025 2:45 PM",
      type: "Unreserved",
      transactionId: "O-0695243",
      referenceId: "o-ref1234",
      location: "18-B9",
      inbound: 139,
      outbound: 36,
      adjustment: 0,
    },
    {
      dateTime: "4/9/2025 1:00 PM",
      type: "Reserved",
      transactionId: "O-0695243",
      referenceId: "demo-3j-k4l-012",
      location: "4-A3",
      inbound: 73,
      outbound: 47,
      adjustment: 0,
    },
    {
      dateTime: "4/8/2025 3:30 PM",
      type: "Unreserved",
      transactionId: "O-0695243",
      referenceId: "ref54321",
      location: "7-F1",
      inbound: 58,
      outbound: 95,
      adjustment: 0,
    },
  ],
  "sku-bcd4455": [
    {
      dateTime: "4/12/2025 10:30 AM",
      type: "Inbound In",
      transactionId: "I-0007264",
      referenceId: "ref12345",
      location: "CAS B2C SHELF",
      inbound: 200,
      outbound: 0,
      adjustment: 0,
    },
  ],
}
