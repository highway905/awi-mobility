"use client"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { InventoryItem, InventoryTotals } from "../types"

interface InventoryTableProps {
  data: InventoryItem[]
  totals: InventoryTotals
  showCustomerColumns?: boolean
}

export function InventoryTable({ data, totals, showCustomerColumns = false }: InventoryTableProps) {
  const router = useRouter()

  const handleRowClick = (sku: string) => {
    router.push(`/inventory/${sku}`)
  }

  return (
    <div className="rounded-md border bg-white">
      <div className="relative">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              {/* Sticky SKU Column */}
              <TableHead className="sticky left-0 bg-white z-20 min-w-[120px] border-r">SKU</TableHead>

              {!showCustomerColumns ? (
                <>
                  <TableHead className="min-w-[100px]">Warehouse</TableHead>
                  <TableHead className="min-w-[150px]">Location</TableHead>
                </>
              ) : (
                <TableHead className="min-w-[150px]">Location</TableHead>
              )}

              <TableHead className="min-w-[100px]">Pallet ID</TableHead>
              <TableHead className="min-w-[80px] text-right">Inbound</TableHead>
              <TableHead className="min-w-[80px] text-right">Outbound</TableHead>
              <TableHead className="min-w-[100px] text-right">Adjustment</TableHead>
              <TableHead className="min-w-[80px] text-right">On Hand</TableHead>

              {showCustomerColumns && (
                <>
                  <TableHead className="min-w-[80px] text-right">Available</TableHead>
                  <TableHead className="min-w-[80px] text-right">On Hold</TableHead>
                </>
              )}

              {/* Sticky Actions Column */}
              <TableHead className="sticky right-0 bg-white z-20 w-[50px] border-l">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(item.sku)}
              >
                {/* Sticky SKU Column */}
                <TableCell className="sticky left-0 bg-white z-10 font-medium border-r">{item.sku}</TableCell>

                {!showCustomerColumns ? (
                  <>
                    <TableCell>{item.warehouse}</TableCell>
                    <TableCell>{item.location}</TableCell>
                  </>
                ) : (
                  <TableCell>{item.location}</TableCell>
                )}

                <TableCell>{item.palletId}</TableCell>
                <TableCell className="text-right">{item.inbound}</TableCell>
                <TableCell className="text-right">{item.outbound}</TableCell>
                <TableCell className="text-right">{item.adjustment}</TableCell>
                <TableCell className="text-right">{item.onHand}</TableCell>

                {showCustomerColumns && (
                  <>
                    <TableCell className="text-right">{item.available || 0}</TableCell>
                    <TableCell className="text-right">{item.onHold || 0}</TableCell>
                  </>
                )}

                {/* Sticky Actions Column */}
                <TableCell className="sticky right-0 bg-white z-10 border-l" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Inventory</DropdownMenuItem>
                      <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter className="sticky bottom-0 bg-gray-50 z-10">
            <TableRow>
              <TableCell className="sticky left-0 bg-gray-50 z-20 font-medium border-r">Total</TableCell>

              {!showCustomerColumns ? (
                <>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </>
              ) : (
                <TableCell></TableCell>
              )}

              <TableCell></TableCell>
              <TableCell className="text-right font-medium">{totals.inbound}</TableCell>
              <TableCell className="text-right font-medium">{totals.outbound}</TableCell>
              <TableCell className="text-right font-medium">{totals.adjustment}</TableCell>
              <TableCell className="text-right font-medium">{totals.onHand}</TableCell>

              {showCustomerColumns && (
                <>
                  <TableCell className="text-right font-medium">{totals.available || 0}</TableCell>
                  <TableCell className="text-right font-medium">{totals.onHold || 0}</TableCell>
                </>
              )}

              <TableCell className="sticky right-0 bg-gray-50 z-20 border-l"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
