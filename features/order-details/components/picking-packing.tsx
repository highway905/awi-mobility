"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchWithCamera } from "@/components/ui/search-with-camera"

// Define the interface for line items from the API
interface LineItem {
  id: string;
  customerSkuId: string;
  sku: string;
  isNonSku: boolean;
  isBundle: boolean;
  itemName: string;
  universalProductCode: string;
  description: string;
  qty: string;
  orderQuantity: number;
}

// Interface for the display in the table
interface PickingItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  primaryUPC: string;
  orderQty: number;
  actualQty: number;
}

interface PickingPackingProps {
  lineItems: LineItem[];
}

export function PickingPacking({ lineItems = [] }: PickingPackingProps) {
  // Transform API data for display, ensure lineItems is an array
  const safeLineItems = Array.isArray(lineItems) ? lineItems : [];
  const pickingItems: PickingItem[] = safeLineItems.map(item => ({
    id: item.id,
    sku: item.sku,
    name: item.itemName,
    description: item.description || '-',
    primaryUPC: item.universalProductCode || '-',
    orderQty: item.orderQuantity,
    actualQty: parseInt(item.qty) || 0,
  }));

  const columns: DataTableColumn<PickingItem>[] = [
    {
      key: "sku",
      header: "SKU",
      headerClassName: "text-gray-500",
    },
    {
      key: "name",
      header: "Name",
      headerClassName: "text-gray-500",
    },
    {
      key: "description",
      header: "Description",
      headerClassName: "text-gray-500",
    },
    {
      key: "primaryUPC",
      header: "Primary UPC",
      headerClassName: "text-gray-500",
    },
    {
      key: "orderQty",
      header: "Order Qty",
      headerClassName: "text-gray-500",
      className: "text-center",
    },
    {
      key: "actualQty",
      header: "Actual Qty",
      render: (value) => <Input type="number" value={value} min="0" className="w-24 mx-auto" />,
      headerClassName: "text-gray-500",
      className: "text-center",
    },
  ]

  return (
    <Card className="h-full flex flex-col p-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0  pb-4">
        <CardTitle className="text-xl font-semibold">Picking & Packing</CardTitle>
        <SearchWithCamera 
          placeholder="Search items..." 
          width="240px" 
          onCamera={() => {
            // Handle camera/barcode scanning
            alert("Camera functionality would open here");
          }}
        />
      </CardHeader>
      <CardContent className="overflow-auto p-0">
        <DataTable columns={columns} data={pickingItems} />
      </CardContent>
    </Card>
  )
}
