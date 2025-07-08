"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Check, ChevronDown, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Instructions {
  id: string
  warehouseInstructions: string
  carrierInstructions: string
}

interface LineItem {
  id: string
  sku: string
  itemName: string
  universalProductCode: string
  description: string
  qty: string
  lotNumber?: string | null
  expirationDate?: string | null
  orderQuantity: number
}

interface WarehouseActionProps {
  instructions: Instructions
  lineItems?: LineItem[]
}

interface InventoryItem {
  id: string
  sku: string
  name: string
  primaryUpc: string
  lotNumber: string
  expirationDate: string
  orderQty: number
  actualQty: number
  expanded: boolean
  palletInfo: PalletInfo[]
}

interface PalletInfo {
  palletId: string
  cartonsOnPallet: number
  pallet: string
  location: string
}

export function WarehouseAction({ instructions, lineItems = [] }: WarehouseActionProps) {
  const [selectedAction, setSelectedAction] = useState<string>("")
  
  const defaultInventoryItems: InventoryItem[] = [
    {
      id: "1",
      sku: "5615514",
      name: "T-shirt",
      primaryUpc: "upc7",
      lotNumber: "S2654654",
      expirationDate: "12/26/2026",
      orderQty: 1,
      actualQty: 1,
      expanded: true,
      palletInfo: [
        {
          palletId: "P0138006",
          cartonsOnPallet: 0,
          pallet: "-",
          location: "10-A10"
        }
      ]
    },
    {
      id: "2",
      sku: "5646134",
      name: "Shirt",
      primaryUpc: "bf65",
      lotNumber: "G6451349",
      expirationDate: "12/26/2026",
      orderQty: 1,
      actualQty: 1,
      expanded: false,
      palletInfo: []
    },
    {
      id: "3",
      sku: "8945636",
      name: "Blended Shirt",
      primaryUpc: "eg489",
      lotNumber: "G7894634",
      expirationDate: "12/26/2026",
      orderQty: 1,
      actualQty: 1,
      expanded: false,
      palletInfo: []
    },
    {
      id: "4",
      sku: "7823451",
      name: "Denim Jeans",
      primaryUpc: "dj124",
      lotNumber: "J9834567",
      expirationDate: "N/A",
      orderQty: 2,
      actualQty: 2,
      expanded: false,
      palletInfo: [
        {
          palletId: "P0245781",
          cartonsOnPallet: 1,
          pallet: "A",
          location: "11-B22"
        }
      ]
    },
    {
      id: "5",
      sku: "6589234",
      name: "Hooded Sweatshirt",
      primaryUpc: "hs987",
      lotNumber: "H1209834",
      expirationDate: "N/A",
      orderQty: 3,
      actualQty: 3,
      expanded: false,
      palletInfo: [
        {
          palletId: "P0356782",
          cartonsOnPallet: 1,
          pallet: "B",
          location: "12-C15"
        }
      ]
    },
    {
      id: "6",
      sku: "4257901",
      name: "Winter Jacket",
      primaryUpc: "wj456",
      lotNumber: "W5672345",
      expirationDate: "N/A",
      orderQty: 1,
      actualQty: 1,
      expanded: false,
      palletInfo: []
    },
    {
      id: "7",
      sku: "3189672",
      name: "Cotton Socks",
      primaryUpc: "cs778",
      lotNumber: "C6781234",
      expirationDate: "N/A",
      orderQty: 10,
      actualQty: 10,
      expanded: false,
      palletInfo: [
        {
          palletId: "P0472193",
          cartonsOnPallet: 2,
          pallet: "C",
          location: "14-D08"
        }
      ]
    }
  ]

  // Transform line items into inventory items, or use default mock data
  const transformedItems = lineItems.length > 0
    ? lineItems.map((item, index) => ({
        id: item.id,
        sku: item.sku,
        name: item.itemName,
        primaryUpc: item.universalProductCode || "-",
        lotNumber: item.lotNumber || `L${Math.floor(Math.random() * 10000000)}`,
        expirationDate: item.expirationDate || (Math.random() > 0.5 ? "12/26/2026" : "N/A"),
        orderQty: item.orderQuantity,
        actualQty: parseInt(item.qty) || 0,
        expanded: index === 0, // Expand the first item by default
        palletInfo: index % 2 === 0 ? [ // Add pallet info for every other item
          {
            palletId: `P${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
            cartonsOnPallet: Math.floor(Math.random() * 5),
            pallet: ["A", "B", "C", "D", "-"][Math.floor(Math.random() * 5)],
            location: `${10 + Math.floor(Math.random() * 10)}-${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${Math.floor(Math.random() * 30)}`
          }
        ] : []
      }))
    : defaultInventoryItems

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(transformedItems)

  const toggleExpand = (id: string) => {
    setInventoryItems(items => 
      items.map(item => 
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    )
  }
  
  return (
    <Card className="h-full flex flex-col border-none p-0">

      <CardContent className="flex-1 overflow-auto border-none p-0">     
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Primary UPC</TableHead>
                  <TableHead>Lot #</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Order Qty</TableHead>
                  <TableHead>Actual Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow className="hover:bg-gray-100 cursor-pointer" onClick={() => toggleExpand(item.id)}>
                      <TableCell className="p-2">
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          {item.expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </Button>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.primaryUpc}</TableCell>
                      <TableCell>{item.lotNumber}</TableCell>
                      <TableCell>{item.expirationDate}</TableCell>
                      <TableCell>{item.orderQty}</TableCell>
                      <TableCell>{item.actualQty}</TableCell>
                    </TableRow>
                    {item.expanded && (
                      <TableRow key={`${item.id}-expanded`} className="bg-gray-50">
                        <TableCell colSpan={8} className="p-0">
                          <div className="px-10 py-2 border rounded-md">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-100 hover:bg-gray-100">
                                  <TableHead>Pallet ID</TableHead>
                                  <TableHead>Cartons / Boxes on Pallet</TableHead>
                                  <TableHead>Pallet</TableHead>
                                  <TableHead>Location</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {item.palletInfo.map((pallet, idx) => (
                                  <TableRow key={`${item.id}-pallet-${idx}`}>
                                    <TableCell>{pallet.palletId}</TableCell>
                                    <TableCell>{pallet.cartonsOnPallet}</TableCell>
                                    <TableCell>{pallet.pallet}</TableCell>
                                    <TableCell>{pallet.location}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

      </CardContent>
    </Card>
  )
}
