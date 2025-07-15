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
import { NoData, NoDataIcons } from "./no-data"

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

// API response types for pallet labels
interface PalletLabelItem {
  palletDisplayId: string
  transactionId: string
  orderId: string
  palletId: string
  totalQty: number
  totalBoxCount: number
  palletSequence: number
  totalPallets: number
  sku: string
  pallet: string
  inventoryLocationName: string
}

interface PalletLabelsResponse {
  items?: PalletLabelItem[]
  totalCount?: number
  // Error response structure
  message?: string
  validationfailed?: boolean
  validationerrors?: any
}

interface ErrorResponse {
  message: string
  validationFailed: boolean
  validationErrors: Array<{
    key: string
    value: string
  }>
}

// API Error Response Structure
interface ApiErrorResponse {
  statusCode: number
  response: {
    message: string
    validationfailed: boolean
    validationerrors: any
  }
  traceId: string
  message: string | null
}

interface WarehouseActionProps {
  instructions: Instructions
  lineItems?: LineItem[] | null
  palletLabelsData?: PalletLabelsResponse | null
  palletLabelsError?: any
  palletLabelsLoading?: boolean
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
  // API data from pallet labels
  palletDisplayId?: string
  totalQty?: number
  totalBoxCount?: number
  palletSequence?: number
  totalPallets?: number
  inventoryLocationName?: string
}

export function WarehouseAction({ 
  instructions, 
  lineItems = null, 
  palletLabelsData, 
  palletLabelsError, 
  palletLabelsLoading 
}: WarehouseActionProps) {
  const [selectedAction, setSelectedAction] = useState<string>("")
  
  // Helper function to safely get line items
  const getSafeLineItems = (): LineItem[] => {
    if (!lineItems) return [];
    if (!Array.isArray(lineItems)) return [];
    return lineItems;
  };

  // Get safe line items array
  const safeLineItems = getSafeLineItems();
  
  // Helper function to get error message from different error types
  const getErrorMessage = (error: any): string => {
    if (!error) return 'Unknown error';
    
    // Handle RTK Query error format
    if (error.status) {
      // Check if error has data with response structure
      if (error.data && error.data.response && error.data.response.message) {
        return error.data.response.message;
      }
      
      // Check if error has direct response structure
      if (error.data && error.data.message) {
        return error.data.message;
      }
      
      // Fallback to generic status code messages only when no specific message is available
      if (error.status === 500) {
        return 'Server error occurred. Please try again later.';
      }
      if (error.status === 404) {
        return 'Pallet information not found for this order.';
      }
      if (error.status === 401 || error.status === 403) {
        return 'Access denied. Please check your permissions.';
      }
      if (error.status === 400) {
        return 'Bad request. Please check the order details.';
      }
    }
    
    // Handle different error object structures
    if (typeof error === 'object') {
      // Check for nested response structure
      if ('data' in error && error.data) {
        if (error.data.response && error.data.response.message) {
          return error.data.response.message;
        }
        
        const errorData = error.data as ErrorResponse;
        if (errorData.message) {
          return errorData.message;
        }
        if (errorData.validationErrors && errorData.validationErrors.length > 0) {
          return `Validation error: ${errorData.validationErrors.map(e => e.value).join(', ')}`;
        }
      }
      if ('message' in error && error.message) {
        return error.message;
      }
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  // Helper function to get pallet info for a specific SKU
  const getPalletInfoForSku = (sku: string): PalletInfo[] => {
    // If palletLabelsData contains an error response, don't process items
    if (palletLabelsData && palletLabelsData.message) {
      return [];
    }

    // Handle different response structures
    let palletItems: PalletLabelItem[] = [];
    
    if (palletLabelsData) {
      // The API transformResponse extracts response, so palletLabelsData should be PalletLabelsResponse
      if (palletLabelsData.items && Array.isArray(palletLabelsData.items)) {
        palletItems = palletLabelsData.items.filter((item: PalletLabelItem) => item.sku === sku);
      } else if (Array.isArray(palletLabelsData)) {
        // In case the data structure is a direct array
        palletItems = palletLabelsData.filter((item: PalletLabelItem) => item.sku === sku);
      }
    }
    
    return palletItems.map((item: PalletLabelItem) => ({
      palletId: item.palletId,
      palletDisplayId: item.palletDisplayId,
      cartonsOnPallet: item.totalBoxCount,
      pallet: item.pallet,
      location: item.inventoryLocationName,
      totalQty: item.totalQty,
      totalBoxCount: item.totalBoxCount,
      palletSequence: item.palletSequence,
      totalPallets: item.totalPallets,
      inventoryLocationName: item.inventoryLocationName
    }))
  }

  // Transform line items into inventory items, don't use mock data when no real line items
  const transformedItems = safeLineItems.length > 0
    ? safeLineItems.map((item, index) => ({
        id: item.id,
        sku: item.sku,
        name: item.itemName,
        primaryUpc: item.universalProductCode || "-",
        lotNumber: item.lotNumber || `L${Math.floor(Math.random() * 10000000)}`,
        expirationDate: item.expirationDate || (Math.random() > 0.5 ? "12/26/2026" : "N/A"),
        orderQty: item.orderQuantity,
        actualQty: parseInt(item.qty) || 0,
        expanded: index === 0, // Expand the first item by default
        palletInfo: getPalletInfoForSku(item.sku) // Use API data based on SKU match
      }))
    : [] // Return empty array when lineItems is null, undefined, or empty

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(transformedItems)

  const toggleExpand = (id: string) => {
    setInventoryItems(items => 
      items.map(item => 
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    )
  }

  // Helper function to render table body content
  const renderTableBody = () => {
    // Show NoData when no inventory items (handles null/undefined/empty lineItems)
    if (inventoryItems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8">
            <NoData 
              title="No warehouse items found"
              description="No items are available for warehouse actions for this order."
              icon={<NoDataIcons.table />}
            />
          </TableCell>
        </TableRow>
      );
    }

    // Always show inventory items if they exist, regardless of pallet API errors
    return inventoryItems.map((item) => (
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
              <div className="px-10 py-2">
                <Table className="border rounded-md">
                  <TableHeader>
                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                      <TableHead>Pallet ID</TableHead>
                      <TableHead>Pallet Display ID</TableHead>
                      <TableHead>Cartons / Boxes on Pallet</TableHead>
                      <TableHead>Pallet</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Total Qty</TableHead>
                      <TableHead>Pallet Sequence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderPalletTableBody(item)}
                  </TableBody>
                </Table>
              </div>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ));
  };

  // Helper function to render pallet table body content
  const renderPalletTableBody = (item: InventoryItem) => {
    // Check for API error in the data response or traditional error
    const hasError = palletLabelsError || (palletLabelsData && palletLabelsData.message);
    
    if (hasError) {
      let errorMessage = '';
      
      if (palletLabelsData && palletLabelsData.message) {
        // Error is in the data response
        errorMessage = palletLabelsData.message;
      } else if (palletLabelsError) {
        // Traditional error response
        errorMessage = getErrorMessage(palletLabelsError);
      }
      
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">
                {errorMessage}
              </p>
              {/* <p className="text-gray-500 text-sm">Please try refreshing the page</p> */}
            </div>
          </TableCell>
        </TableRow>
      );
    }

    // Show pallet data if available
    if (item.palletInfo.length > 0) {
      return item.palletInfo.map((pallet, idx) => (
        <TableRow key={`${item.id}-pallet-${idx}`}>
          <TableCell>{pallet.palletId}</TableCell>
          <TableCell>{pallet.palletDisplayId || '-'}</TableCell>
          <TableCell>{pallet.cartonsOnPallet}</TableCell>
          <TableCell>{pallet.pallet}</TableCell>
          <TableCell>{pallet.location}</TableCell>
          <TableCell>{pallet.totalQty || '-'}</TableCell>
          <TableCell>{pallet.palletSequence || '-'}</TableCell>
        </TableRow>
      ));
    }

    // Show no data message when no pallet info for this SKU
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-4">
          <p className="text-gray-500">No pallet information available for this SKU</p>
        </TableCell>
      </TableRow>
    );
  };
  
  return (
    <Card className="h-full flex flex-col border-none p-0">

      <CardContent className="flex-1 overflow-auto border-none p-0">
        {palletLabelsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading warehouse data...</p>
            </div>
          </div>
        ) : (
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
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
