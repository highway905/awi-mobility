"use client"

import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, X, ArrowLeft, ArrowRight, Plus, Printer, Search } from "lucide-react"

interface SKUItem {
  id: string
  sku: string
  description: string
  totalQty: number
  selected: boolean
}

interface PalletItem {
  id: string
  sku: string
  description: string
  totalQty: number
}

interface Pallet {
  id: string
  palletId: string
  location: string
  expanded: boolean
  items: PalletItem[]
}

interface AvailablePallet {
  id: string
  palletId: string
  location: string
  type: string
  selected: boolean
}

const initialSKUItems: SKUItem[] = [
  { id: "1", sku: "SKU-1415QRST", description: "LifeSimplifier", totalQty: 9, selected: false },
  { id: "2", sku: "SKU-1617UVWX", description: "ToughGuard", totalQty: 2, selected: false },
  { id: "3", sku: "SKU-1819YZAB", description: "TechNova", totalQty: 4, selected: false },
  { id: "4", sku: "SKU-2021CDEF", description: "PowerPouch", totalQty: 6, selected: false },
  { id: "5", sku: "SKU-2223GHIJ", description: "Expectation Keeper", totalQty: 2, selected: false },
]

const availablePallets: AvailablePallet[] = [
  { id: "1", palletId: "MN6789", location: "A-6-5", type: "Rack", selected: false },
  { id: "2", palletId: "XJ4567", location: "A-1-10", type: "Rack", selected: false },
  { id: "3", palletId: "QR1234", location: "A-4-7", type: "Rack", selected: false },
  { id: "4", palletId: "EF1234", location: "A-8-3", type: "Rack", selected: false },
  { id: "5", palletId: "AB3456", location: "A-10-1", type: "Rack", selected: false },
  { id: "6", palletId: "YH9901", location: "A-9-2", type: "Rack", selected: false },
]

function DraggableSKURow({ item, onSelect }: { item: SKUItem; onSelect: (id: string, checked: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sku-${item.id}`, // Add prefix to avoid ID conflicts
    data: { 
      type: 'sku-item', // Clear data type
      item 
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
      }
    : undefined

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`cursor-move transition-opacity ${isDragging ? 'opacity-50' : ''}`}
    >
      <TableCell>
        <Checkbox
          checked={item.selected}
          onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking checkbox
        />
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{item.sku}</div>
          <div className="text-sm text-gray-500">{item.description}</div>
        </div>
      </TableCell>
      <TableCell>{item.totalQty}</TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-6 h-6 p-0" 
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking info button
        >
          ⓘ
        </Button>
      </TableCell>
    </TableRow>
  )
}

function DroppablePallet({
  pallet,
  onToggleExpansion,
  onRemoveItem,
}: {
  pallet: Pallet
  onToggleExpansion: (id: string) => void
  onRemoveItem: (palletId: string, itemId: string) => void
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `pallet-${pallet.id}`, // Add prefix to avoid ID conflicts
    data: {
      type: 'pallet',
      pallet
    }
  })

  return (
    <Card
      ref={setNodeRef}
      className={`transition-colors ${isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onToggleExpansion(pallet.id)} className="p-0 h-auto">
              {pallet.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            <div>
              <div className="font-medium">Pallet #{pallet.id.padStart(2, "0")}</div>
              <div className="text-sm text-gray-500">{pallet.palletId}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Location</div>
            <div className="text-sm text-gray-500">{pallet.location}</div>
          </div>
          <Button variant="link" size="sm" className="p-0 h-auto text-orange-600">
            Set Location
          </Button>
        </div>
      </CardHeader>
      {pallet.expanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {pallet.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{item.sku}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.totalQty}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(pallet.id, item.id)}
                    className="w-6 h-6 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            {pallet.items.length === 0 && (
              <div className={`text-center py-8 text-gray-500 text-sm border-2 border-dashed rounded-lg transition-colors ${
                isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                {isOver ? 'Drop here!' : 'Drag SKU items here or use move buttons'}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export function PalletAssignmentTab() {
  const [skuItems, setSKUItems] = useState<SKUItem[]>(initialSKUItems)
  const [pallets, setPallets] = useState<Pallet[]>([
    {
      id: "1",
      palletId: "4729-BX",
      location: "NA",
      expanded: true,
      items: [
        { id: "1", sku: "SKU-1234ABCD", description: "TaskMaster Pro", totalQty: 7 },
        { id: "2", sku: "SKU-5678EFGH", description: "EffiTool", totalQty: 3 },
        { id: "3", sku: "SKU-9101IJKL", description: "Chameleon Clip", totalQty: 1 },
        { id: "4", sku: "SKU-1213MNOP", description: "StyleSync", totalQty: 5 },
      ],
    },
    {
      id: "2",
      palletId: "4728-BX",
      location: "NA",
      expanded: false,
      items: [],
    },
    {
      id: "3",
      palletId: "4729-BX",
      location: "NA",
      expanded: false,
      items: [],
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPallets, setSelectedPallets] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleSKUSelection = (id: string, checked: boolean) => {
    setSKUItems((prev) => prev.map((item) => (item.id === id ? { ...item, selected: checked } : item)))
  }

  const handleSelectAll = (checked: boolean) => {
    setSKUItems((prev) => prev.map((item) => ({ ...item, selected: checked })))
  }

  const togglePalletExpansion = (palletId: string) => {
    setPallets((prev) =>
      prev.map((pallet) => (pallet.id === palletId ? { ...pallet, expanded: !pallet.expanded } : pallet)),
    )
  }

  const removePalletItem = (palletId: string, itemId: string) => {
    setPallets((prev) =>
      prev.map((pallet) =>
        pallet.id === palletId ? { ...pallet, items: pallet.items.filter((item) => item.id !== itemId) } : pallet,
      ),
    )
  }

  const handlePalletSelection = (palletId: string, checked: boolean) => {
    if (checked) {
      setSelectedPallets((prev) => [...prev, palletId])
    } else {
      setSelectedPallets((prev) => prev.filter((id) => id !== palletId))
    }
  }

  const addSelectedPallets = () => {
    const newPallets = availablePallets
      .filter((pallet) => selectedPallets.includes(pallet.id))
      .map((pallet) => ({
        id: `new-${Date.now()}-${pallet.id}`,
        palletId: pallet.palletId,
        location: pallet.location,
        expanded: false,
        items: [],
      }))

    setPallets((prev) => [...prev, ...newPallets])
    setSelectedPallets([])
    setIsDialogOpen(false)
  }

  const moveSelectedItems = (direction: "left" | "right") => {
    if (direction === "right") {
      // Move selected SKU items to first available pallet
      const selectedItems = skuItems.filter((item) => item.selected)
      if (selectedItems.length > 0 && pallets.length > 0) {
        const targetPallet = pallets[0]
        const newPalletItems = selectedItems.map((item) => ({
          id: `item-${Date.now()}-${item.id}`,
          sku: item.sku,
          description: item.description,
          totalQty: item.totalQty,
        }))

        setPallets((prev) =>
          prev.map((pallet) =>
            pallet.id === targetPallet.id ? { ...pallet, items: [...pallet.items, ...newPalletItems] } : pallet,
          ),
        )

        setSKUItems((prev) => prev.filter((item) => !item.selected))
      }
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    // Extract the actual IDs by removing prefixes
    const activeId = active.id.toString().replace('sku-', '')
    const overId = over.id.toString().replace('pallet-', '')

    // Find the dragged item and target pallet
    const draggedItem = skuItems.find((item) => item.id === activeId)
    const targetPallet = pallets.find((pallet) => pallet.id === overId)

    if (draggedItem && targetPallet) {
      const newItem: PalletItem = {
        id: `item-${Date.now()}-${draggedItem.id}`,
        sku: draggedItem.sku,
        description: draggedItem.description,
        totalQty: draggedItem.totalQty,
      }

      // Add item to target pallet
      setPallets((prev) =>
        prev.map((pallet) => 
          pallet.id === overId 
            ? { ...pallet, items: [...pallet.items, newItem] } 
            : pallet
        ),
      )

      // Remove item from SKU list
      setSKUItems((prev) => prev.filter((item) => item.id !== activeId))
    }
  }

  const filteredPallets = availablePallets.filter(
    (pallet) =>
      pallet.palletId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Fix the active drag item lookup
  const activeDragItem = activeId 
    ? skuItems.find((item) => `sku-${item.id}` === activeId) 
    : null

  const NoDataComponent = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Pallets Added</h3>
      <p className="text-sm text-gray-500 mb-4">Add pallets to start assigning SKU items</p>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Add Your First Pallet</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Pallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Locations</TabsTrigger>
                <TabsTrigger value="empty">Empty Locations</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Pallet ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPallets.map((pallet) => (
                      <TableRow key={pallet.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPallets.includes(pallet.id)}
                            onCheckedChange={(checked) => handlePalletSelection(pallet.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{pallet.palletId}</TableCell>
                        <TableCell>{pallet.location}</TableCell>
                        <TableCell>{pallet.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="empty">
                <div className="text-center py-8 text-gray-500">No empty locations available</div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addSelectedPallets} disabled={selectedPallets.length === 0}>
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Assign Pallet / Location</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Add Pallet</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Select Pallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all">All Locations</TabsTrigger>
                      <TabsTrigger value="empty">Empty Locations</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Pallet ID</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPallets.map((pallet) => (
                            <TableRow key={pallet.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedPallets.includes(pallet.id)}
                                  onCheckedChange={(checked) => handlePalletSelection(pallet.id, checked as boolean)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{pallet.palletId}</TableCell>
                              <TableCell>{pallet.location}</TableCell>
                              <TableCell>{pallet.type}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="empty">
                      <div className="text-center py-8 text-gray-500">No empty locations available</div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addSelectedPallets} disabled={selectedPallets.length === 0}>
                      Confirm
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {pallets.length === 0 ? (
          <NoDataComponent />
        ) : (
          <div className="grid grid-cols-[1fr_5%_1fr] gap-6">
            {/* Left Side - SKU Items */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox checked={skuItems.every((item) => item.selected)} onCheckedChange={handleSelectAll} />
                      </TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Total Qty</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skuItems.map((item) => (
                      <DraggableSKURow key={item.id} item={item} onSelect={handleSKUSelection} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Middle - Move Buttons */}
            <div className="flex flex-col items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveSelectedItems("right")}
                disabled={!skuItems.some((item) => item.selected)}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => moveSelectedItems("left")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* Right Side - Pallets */}
            <div className="space-y-4">
              {pallets.map((pallet) => (
                <DroppablePallet
                  key={pallet.id}
                  pallet={pallet}
                  onToggleExpansion={togglePalletExpansion}
                  onRemoveItem={removePalletItem}
                />
              ))}
            </div>
          </div>
        )}

        <DragOverlay>
          {activeDragItem ? (
            <div className="bg-white border rounded-lg p-2 shadow-lg opacity-90">
              <div className="font-medium">{activeDragItem.sku}</div>
              <div className="text-sm text-gray-500">{activeDragItem.description}</div>
            </div>
          ) : null}
        </DragOverlay>
      </Card>
    </DndContext>
  )
}