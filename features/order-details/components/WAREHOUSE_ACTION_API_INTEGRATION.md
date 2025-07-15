# Warehouse Action API Integration

This document explains the integration of the `useGetPrintPalletLabelsQuery` API into the Warehouse Action tab.

## Overview

The Warehouse Action component has been enhanced to integrate with the Print Pallet Labels API to provide real-time pallet information based on SKU matching.

## Changes Made

### 1. API Integration
- **Hook**: `useGetPrintPalletLabelsQuery` from `@/lib/redux/api/orderManagement`
- **Payload**: 
  ```typescript
  {
    searchKey: "",
    sortColumn: "",
    sortDirection: "", 
    pageIndex: 0,
    pageSize: 100,
    orderId: orderId
  }
  ```

### 2. Interface Updates
- Added `PalletLabelItem` interface for API response typing
- Added `PalletLabelsResponse` interface for response structure
- Added `ErrorResponse` interface for error handling
- Updated `WarehouseActionProps` to include `orderId: string`
- Enhanced `PalletInfo` interface with API data fields

### 3. Data Flow
1. Component receives `orderId` as prop
2. API call is made with `orderId` in payload
3. Response data is filtered by SKU to match line items
4. Pallet information is mapped to each inventory item
5. Data is displayed in nested table rows when items are expanded

### 4. Error Handling
- **Loading State**: Shows spinner and loading message
- **Error State**: Shows error message with details from API response
- **Empty State**: Shows "No Data" component when no items exist
- **No Pallet Data**: Shows message when no pallet info available for a SKU

### 5. UI Enhancements
- Added more columns to pallet table (Pallet Display ID, Total Qty, Pallet Sequence)
- Enhanced error messages with proper error parsing
- Added loading indicators for both main table and nested pallet data
- Improved responsive design with better spacing

## API Response Mapping

### Success Response (200)
```typescript
{
  statusCode: 0,
  response: {
    items: [
      {
        palletDisplayId: string
        palletId: string
        totalQty: number
        totalBoxCount: number
        sku: string
        pallet: string
        inventoryLocationName: string
        // ... other fields
      }
    ]
  }
}
```

### Error Response (400/500)
```typescript
{
  statusCode: 0,
  response: {
    message: string
    validationFailed: boolean
    validationErrors: Array<{key: string, value: string}>
  }
}
```

## Usage

The component now requires the `orderId` prop:

```tsx
<WarehouseAction 
  instructions={instructions}
  lineItems={lineItems}
  orderId={orderId}
/>
```

## Features

1. **Real-time Data**: Pallet information is fetched live from the API
2. **SKU Matching**: Pallet data is automatically matched to line items by SKU
3. **Error Resilience**: Graceful handling of API errors with user-friendly messages
4. **Loading States**: Clear indication when data is being loaded
5. **Empty States**: Appropriate messages when no data is available
6. **Nested Display**: Pallet information is shown in expandable nested tables

## Benefits

- **Accurate Data**: Real pallet information instead of mock data
- **User Experience**: Clear loading and error states
- **Maintainability**: Proper error handling and type safety
- **Scalability**: Supports different order types and varying pallet configurations
