"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchWithCamera } from "@/components/ui/search-with-camera"
import { NoData, NoDataIcons } from "./no-data"

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

  // State to manage actual quantities for each item
  const [actualQuantities, setActualQuantities] = useState<Record<string, number>>(() => {
    const initialQuantities: Record<string, number> = {};
    pickingItems.forEach(item => {
      initialQuantities[item.id] = item.actualQty;
    });
    return initialQuantities;
  });

  // Handle quantity change
  const handleQuantityChange = (itemId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setActualQuantities(prev => ({
      ...prev,
      [itemId]: numValue
    }));
  };

  // Create empty state component
  const emptyState = (
    <NoData 
      title="No items to pick"
      description="No items are available for picking and packing for this order."
      icon={<NoDataIcons.table />}
    />
  );

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
      render: (value, item) => (
        <Input 
          type="number" 
          value={actualQuantities[item.id] ?? value} 
          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
          min="0" 
          className="w-24 mx-auto" 
        />
      ),
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
        <DataTable 
          columns={columns} 
          data={pickingItems} 
          emptyState={emptyState}
        />
      </CardContent>
    </Card>
  )
}
