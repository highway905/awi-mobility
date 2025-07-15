# Advanced Features Usage Guide

This guide shows how to integrate the new advanced features (column customization, advanced filters, virtual scrolling, and bulk actions) into other pages.

## 🔧 Quick Integration

### Column Customization

```tsx
import { useColumnCustomization } from '@/features/orders/hooks/useColumnCustomization'
import { ColumnCustomizationSheet } from '@/features/orders/components/column-customization-sheet'

function MyDataPage() {
  const [showColumnSheet, setShowColumnSheet] = useState(false)
  
  // Initialize column customization for your page type
  const columnCustomization = useColumnCustomization('inventory') // or 'tasks', 'customers', etc.
  
  const {
    visibleColumns,
    stickyColumns,
    isLoading,
    isDirty,
    saveColumns
  } = columnCustomization

  // Use visibleColumns to filter your table columns
  const tableColumns = baseColumns.filter(col => 
    visibleColumns.some(visibleCol => visibleCol.id === col.key)
  ).map(col => {
    const customCol = visibleColumns.find(visibleCol => visibleCol.id === col.key)
    return {
      ...col,
      width: customCol?.width || col.minWidth,
    }
  })

  return (
    <>
      <AdvancedTable
        columns={tableColumns}
        stickyColumns={stickyColumns}
        // ... other props
      />
      
      <ColumnCustomizationSheet
        isOpen={showColumnSheet}
        onClose={() => setShowColumnSheet(false)}
      />
    </>
  )
}
```

### Advanced Filters

```tsx
import { useAdvancedFilters } from '@/features/orders/hooks/useAdvancedFilters'
import { FilterSheet } from '@/features/orders/components/filter-sheet'

function MyDataPage() {
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  
  const advancedFilters = useAdvancedFilters()
  
  const {
    currentFilter,
    savedPresets,
    validationErrors,
    applyFilter,
    savePreset,
    loadPreset,
    validateFilter
  } = advancedFilters

  // Apply filters to your API call
  const apiPayload = {
    ...basePayload,
    ...currentFilter
  }

  return (
    <>
      <Button onClick={() => setShowFilterSheet(true)}>
        Advanced Filters
      </Button>
      
      <FilterSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onFiltersApply={(filters) => {
          applyFilter(filters)
          setShowFilterSheet(false)
        }}
      />
    </>
  )
}
```

### Virtual Scrolling

```tsx
import { useVirtualScroll } from '@/features/orders/hooks/useVirtualScrollSimple'

function MyDataPage() {
  const myData = useMyDataQuery() // Your data source
  
  const {
    shouldVirtualize,
    visibleItems,
    scrollElementRef,
    handleScroll,
    getContainerStyle,
    getInnerStyle,
    scrollToTop
  } = useVirtualScroll(myData, {
    itemHeight: 60,
    containerHeight: 600,
    threshold: 1000 // Enable virtualization for >1000 items
  })

  return (
    <div
      ref={scrollElementRef}
      style={getContainerStyle()}
      onScroll={handleScroll}
    >
      <div style={getInnerStyle()}>
        {(shouldVirtualize ? visibleItems : myData).map((item, index) => (
          <div
            key={item.id}
            style={shouldVirtualize ? getItemStyle(index) : {}}
          >
            {/* Your item content */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Enhanced Bulk Actions

```tsx
import { useBulkActions, createOrderBulkActions } from '@/features/orders/hooks/useBulkActions'

function MyDataPage() {
  const enhancedBulkActions = useBulkActions<MyDataType>()
  
  const {
    selectedItems,
    selectedCount,
    isLoading,
    actionProgress,
    selectItem,
    selectAll,
    deselectAll,
    executeBulkAction
  } = enhancedBulkActions

  // Create your custom bulk actions
  const myBulkActions = [
    {
      id: 'delete',
      label: 'Delete Selected',
      requiresConfirmation: true,
      isDestructive: true,
      handler: async (items) => {
        // Your delete logic
        return { success: true, successCount: items.length }
      }
    },
    {
      id: 'export',
      label: 'Export Selected',
      handler: async (items) => {
        // Your export logic
        return { success: true }
      }
    }
  ]

  const handleBulkAction = async (actionId: string, selectedRows: MyDataType[]) => {
    const action = myBulkActions.find(a => a.id === actionId)
    if (action) {
      await executeBulkAction(action, selectedRows)
    }
  }

  return (
    <AdvancedTable
      data={myData}
      enableBulkSelection={true}
      onBulkAction={handleBulkAction}
      // ... other props
    />
  )
}
```

## 🎯 Complete Integration Example

```tsx
"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { AdvancedTable } from "@/components/shared/advanced-table"

// Import the enhanced hooks
import { useColumnCustomization } from '@/features/orders/hooks/useColumnCustomization'
import { useAdvancedFilters } from '@/features/orders/hooks/useAdvancedFilters'
import { useBulkActions } from '@/features/orders/hooks/useBulkActions'
import { useVirtualScroll } from '@/features/orders/hooks/useVirtualScrollSimple'

// Import the enhanced UI components
import { FilterSheet } from '@/features/orders/components/filter-sheet'
import { ColumnCustomizationSheet } from '@/features/orders/components/column-customization-sheet'

export function MyAdvancedDataPage() {
  // UI state
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [showColumnSheet, setShowColumnSheet] = useState(false)

  // Enhanced features
  const columnCustomization = useColumnCustomization('my-page-type')
  const advancedFilters = useAdvancedFilters()
  const enhancedBulkActions = useBulkActions<MyDataType>()

  // Data fetching with filters applied
  const { data: myData } = useMyDataQuery({
    ...advancedFilters.currentFilter
  })

  // Column management
  const { visibleColumns, stickyColumns } = columnCustomization
  
  const columns = useMemo(() => {
    const baseColumns = [
      { key: "id", header: "ID", sortable: true, minWidth: 100 },
      { key: "name", header: "Name", sortable: true, minWidth: 150 },
      { key: "status", header: "Status", sortable: true, minWidth: 120 },
      // ... more columns
    ]

    return baseColumns.filter(col => 
      visibleColumns.some(visibleCol => visibleCol.id === col.key)
    ).map(col => {
      const customCol = visibleColumns.find(visibleCol => visibleCol.id === col.key)
      return {
        ...col,
        width: customCol?.width || col.minWidth,
      }
    })
  }, [visibleColumns])

  // Virtual scrolling
  const {
    shouldVirtualize,
    visibleItems,
    scrollElementRef,
    handleScroll,
    getContainerStyle
  } = useVirtualScroll(myData || [], {
    itemHeight: 60,
    containerHeight: 600,
    threshold: 500
  })

  // Bulk actions
  const { selectedItems, executeBulkAction } = enhancedBulkActions

  const myBulkActions = [
    {
      id: 'update-status',
      label: 'Update Status',
      handler: async (items: MyDataType[]) => {
        // Your bulk update logic
        return { success: true, successCount: items.length }
      }
    }
  ]

  const handleBulkAction = async (actionId: string, selectedRows: MyDataType[]) => {
    const action = myBulkActions.find(a => a.id === actionId)
    if (action) {
      await executeBulkAction(action, selectedRows)
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1>My Advanced Data Page</h1>
        
        <div className="flex gap-2">
          <Button onClick={() => setShowFilterSheet(true)}>
            Advanced Filters
          </Button>
          <Button onClick={() => setShowColumnSheet(true)}>
            Customize Columns
          </Button>
        </div>
      </div>

      <AdvancedTable.Root
        data={shouldVirtualize ? visibleItems : myData}
        columns={columns}
        enableBulkSelection={true}
        onBulkAction={handleBulkAction}
        stickyColumns={stickyColumns}
      >
        <AdvancedTable.Container
          style={shouldVirtualize ? getContainerStyle() : undefined}
          onScroll={shouldVirtualize ? handleScroll : undefined}
          ref={shouldVirtualize ? scrollElementRef : undefined}
        >
          <AdvancedTable.Table>
            <AdvancedTable.Header />
            <AdvancedTable.Body />
          </AdvancedTable.Table>
        </AdvancedTable.Container>
        <AdvancedTable.BulkActions />
      </AdvancedTable.Root>

      {/* Enhanced Sheets */}
      <FilterSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onFiltersApply={(filters) => {
          advancedFilters.applyFilter(filters)
          setShowFilterSheet(false)
        }}
      />

      <ColumnCustomizationSheet
        isOpen={showColumnSheet}
        onClose={() => setShowColumnSheet(false)}
      />
    </div>
  )
}
```

## 🔧 Configuration Options

### Column Customization Configuration

```tsx
// Customize the page type for API calls
const columnCustomization = useColumnCustomization('inventory') // 'orders', 'tasks', 'customers', etc.

// Access all available features
const {
  visibleColumns,        // Array of visible columns with settings
  stickyColumns,         // Object with left/right sticky column IDs
  isLoading,            // Loading state for API calls
  isDirty,              // Whether there are unsaved changes
  toggleColumn,         // Toggle column visibility
  reorderColumns,       // Reorder columns via drag & drop
  updateColumnWidth,    // Update column width
  pinColumn,           // Pin/unpin columns
  resetColumns,        // Reset to defaults
  saveColumns         // Save changes to API
} = columnCustomization
```

### Advanced Filters Configuration

```tsx
const advancedFilters = useAdvancedFilters()

const {
  currentFilter,        // Current filter state
  savedPresets,        // Array of saved filter presets
  validationErrors,    // Array of validation errors
  isLoading,          // Loading state
  applyFilter,        // Apply new filter
  clearFilter,        // Clear current filter
  savePreset,         // Save current filter as preset
  loadPreset,         // Load a saved preset
  deletePreset,       // Delete a preset
  validateFilter      // Validate filter input
} = advancedFilters
```

### Virtual Scrolling Configuration

```tsx
const virtualScroll = useVirtualScroll(data, {
  itemHeight: 60,        // Height of each item in pixels
  containerHeight: 600,  // Height of the scroll container
  overscan: 5,          // Number of items to render outside viewport
  threshold: 1000       // Minimum items to enable virtualization
})
```

### Bulk Actions Configuration

```tsx
const bulkActions = useBulkActions<DataType>()

// Create custom bulk actions
const customActions = [
  {
    id: 'action-id',
    label: 'Action Label',
    description: 'Action description',
    icon: <IconComponent />,
    requiresConfirmation: true,  // Show confirmation dialog
    isDestructive: true,         // Mark as destructive action
    confirmMessage: 'Are you sure?',
    handler: async (items) => {
      // Your action logic
      return { 
        success: true, 
        successCount: items.length,
        message: 'Action completed'
      }
    }
  }
]
```

## 🎯 Best Practices

1. **Column Customization**: Always provide meaningful default column configurations
2. **Advanced Filters**: Implement proper validation for filter inputs
3. **Virtual Scrolling**: Use appropriate item heights and container sizes
4. **Bulk Actions**: Provide clear feedback and confirmation for destructive actions
5. **Error Handling**: Always handle API errors gracefully
6. **Performance**: Use React.memo and useCallback for expensive operations
7. **Accessibility**: Ensure keyboard navigation and screen reader support

## 📋 Migration Checklist

When adding these features to a new page:

- [ ] Import the required hooks
- [ ] Set up UI state for sheets/modals
- [ ] Configure column customization with appropriate page type
- [ ] Set up advanced filters if needed
- [ ] Implement virtual scrolling for large datasets
- [ ] Create custom bulk actions
- [ ] Add filter and column buttons to your UI
- [ ] Test all features with real data
- [ ] Ensure proper error handling
- [ ] Verify SSR compatibility

This architecture provides a solid foundation for data-heavy pages with enterprise-level features while maintaining excellent performance and user experience.
