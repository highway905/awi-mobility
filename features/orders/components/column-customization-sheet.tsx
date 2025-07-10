"use client"

import { useState, useCallback, useEffect } from "react"
import { X, GripVertical, Save, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export interface OrderColumnConfig {
  id: string
  label: string
  visible: boolean
  order: number
  width?: number
  pinned?: 'left' | 'right' | null
}

interface ColumnCustomizationSheetProps {
  isOpen: boolean
  onClose: () => void
  onColumnsChange?: (columns: OrderColumnConfig[]) => void
  onSaveColumns?: (columns: OrderColumnConfig[]) => Promise<{ success: boolean; error?: string }>
  onResetColumns?: () => void
  columns?: OrderColumnConfig[]
  isLoading?: boolean
  error?: string | null
}

interface SortableColumnItemProps {
  column: OrderColumnConfig
  onToggle: (columnId: string) => void
}

function SortableColumnItem({ column, onToggle }: SortableColumnItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-3 p-4 hover:bg-gray-50 rounded-lg border ${
        isDragging ? "bg-gray-50 border-gray-300 shadow-md" : "border-gray-200"
      }`}
    >
      {/* Header row with drag handle, name, and visibility toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{column.label}</span>
            {column.pinned && (
              <Badge variant="secondary" className="text-xs">
                {column.pinned === 'left' ? 'Left' : 'Right'}
              </Badge>
            )}
          </div>
        </div>
        <Switch 
          checked={column.visible} 
          onCheckedChange={() => onToggle(column.id)} 
        />
      </div>
    </div>
  )
}

export function ColumnCustomizationSheet({ 
  isOpen, 
  onClose, 
  onColumnsChange, 
  onSaveColumns, 
  onResetColumns,
  columns = [],
  isLoading = false,
  error = null
}: ColumnCustomizationSheetProps) {
  // Local state for column management
  const [localColumns, setLocalColumns] = useState<OrderColumnConfig[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Handle initialization and cleanup with useEffect
  useEffect(() => {
    if (isOpen && !isInitialized) {
      // Deep copy to avoid reference issues
      try {
        const copiedColumns = columns ? [...columns] : [];
        setLocalColumns(copiedColumns);
        setIsDirty(false);
        setIsInitialized(true);
      } catch (err) {
        console.error("Error initializing columns:", err);
      }
    } else if (!isOpen && isInitialized) {
      setIsInitialized(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Deliberately exclude columns to prevent loops
  
  // Track dirty state with useEffect instead of in render
  useEffect(() => {
    if (isInitialized) {
      const hasChanges = JSON.stringify(localColumns) !== JSON.stringify(columns);
      if (hasChanges !== isDirty) {
        setIsDirty(hasChanges);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localColumns, isDirty, isInitialized]); // Deliberately exclude columns to prevent loops

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const toggleColumn = useCallback((columnId: string) => {
    setLocalColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    )
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = localColumns.findIndex((item: OrderColumnConfig) => item.id === active.id)
      const newIndex = localColumns.findIndex((item: OrderColumnConfig) => item.id === over?.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newColumns = [...localColumns]
        const [moved] = newColumns.splice(oldIndex, 1)
        newColumns.splice(newIndex, 0, moved)
        
        // Update order values
        const reorderedColumns = newColumns.map((col, index) => ({
          ...col,
          order: index
        }))
        
        setLocalColumns(reorderedColumns)
      }
    }
  }, [localColumns])

  const handleSave = useCallback(async () => {
    if (onSaveColumns) {
      const result = await onSaveColumns(localColumns)
      if (result.success) {
        onColumnsChange?.(localColumns.filter(col => col.visible))
        onClose()
      }
    } else {
      onColumnsChange?.(localColumns.filter(col => col.visible))
      onClose()
    }
  }, [localColumns, onSaveColumns, onColumnsChange, onClose])

  const handleReset = useCallback(() => {
    if (onResetColumns) {
      onResetColumns()
    }
  }, [onResetColumns])

  const visibleColumns = localColumns.filter(col => col.visible)

  // Show error state
  if (error) {
    return (
      <Sheet 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open && typeof onClose === 'function') {
            onClose();
          }
        }}
        modal={true}
      >
        <SheetContent side="right" className="w-96 flex flex-col p-0">
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4 border-b">
            <SheetTitle>Column Settings</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load column settings</p>
              <p className="text-sm text-gray-500">{error}</p>
              <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && typeof onClose === 'function') {
          onClose();
        }
      }}
      modal={true}
    >
      <SheetContent side="right" className="w-96 flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4 border-b">
          <div>
            <SheetTitle>Column Settings</SheetTitle>
            <p className="text-sm text-gray-600 mt-1">
              Customize visibility, order, and width
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        {/* Loading state */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">Loading column settings...</span>
            </div>
          </div>
        )}

        {/* Main content */}
        {!isLoading && (
          <>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={localColumns.map((col: OrderColumnConfig) => col.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {localColumns.map((column: OrderColumnConfig) => (
                      <SortableColumnItem 
                        key={column.id} 
                        column={column} 
                        onToggle={toggleColumn}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Summary and Actions */}
            <div className="border-t p-6 bg-white">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    {visibleColumns.length} of {localColumns.length} columns visible
                  </span>
                  {isDirty && (
                    <Badge variant="secondary">
                      Unsaved changes
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="flex-1"
                  disabled={isLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof onClose === 'function') {
                      onClose();
                    }
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="flex-1"
                  disabled={isLoading || !isDirty}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
