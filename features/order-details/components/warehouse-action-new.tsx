"use client"

import { useState } from "react"
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
    }
  ]

  // Transform line items into inventory items, or use default mock data
  const transformedItems = lineItems.length > 0
    ? lineItems.map((item, index) => ({
        id: item.id,
        sku: item.sku,
        name: item.itemName,
        primaryUpc: item.universalProductCode || "-",
        lotNumber: item.lotNumber || "S2654654",
        expirationDate: item.expirationDate || "12/26/2026",
        orderQty: item.orderQuantity,
        actualQty: parseInt(item.qty) || 0,
        expanded: index === 0, // Expand the first item by default
        palletInfo: index === 0 ? [
          {
            palletId: "P0138006",
            cartonsOnPallet: 0,
            pallet: "-",
            location: "10-A10"
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Warehouse Action</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Tabs defaultValue="actions">
          <TabsList className="mb-4">
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="history">Action History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="actions" className="space-y-4">
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
                    <>
                      <TableRow key={item.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => toggleExpand(item.id)}>
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
                            <div className="px-10 py-2">
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
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-4 border rounded-md mt-4">
              <h3 className="font-medium mb-4">Available Actions</h3>
              
              <div className="space-y-4">
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Select Action</label>
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an action..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assign-location">Assign Location</SelectItem>
                      <SelectItem value="update-inventory">Update Inventory</SelectItem>
                      <SelectItem value="generate-label">Generate Label</SelectItem>
                      <SelectItem value="mark-damaged">Mark Damaged/Defective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedAction === "assign-location" && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Location ID</label>
                      <Input placeholder="Enter location ID" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea placeholder="Enter optional notes" />
                    </div>
                    <Button className="mt-2">
                      <Check className="h-4 w-4 mr-2" /> Save Location
                    </Button>
                  </div>
                )}
                
                {!selectedAction && (
                  <div className="text-gray-600 text-sm p-4 bg-gray-50 rounded-md">
                    Please select an action from the dropdown above to proceed.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="instructions" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Warehouse Instructions</h3>
                <Textarea
                  value={instructions.warehouseInstructions || "No warehouse instructions provided."}
                  readOnly
                  className="min-h-[100px] bg-gray-50"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Carrier Instructions</h3>
                <Textarea
                  value={instructions.carrierInstructions || "No carrier instructions provided."}
                  readOnly
                  className="min-h-[100px] bg-gray-50"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              <div className="border-b pb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Assigned Location: 10-A10</span>
                  <span className="text-sm text-gray-500">2025-07-05 10:30 AM</span>
                </div>
                <div className="text-sm text-gray-700">By: John Doe</div>
                <div className="text-sm text-gray-600 mt-1">T-shirt placed in Storage Zone A</div>
              </div>
              
              <div className="border-b pb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Updated Inventory Count</span>
                  <span className="text-sm text-gray-500">2025-07-04 02:15 PM</span>
                </div>
                <div className="text-sm text-gray-700">By: Sarah Smith</div>
                <div className="text-sm text-gray-600 mt-1">Verified SKU quantities after receiving</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
