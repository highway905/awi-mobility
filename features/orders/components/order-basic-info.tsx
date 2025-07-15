"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderBasicInfoProps {
  orderId: string
}

export function OrderBasicInfo({ orderId }: OrderBasicInfoProps) {
  return (
    <Card className="mx-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Basic Information</CardTitle>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Transaction ID</label>
              <div className="font-medium">{orderId}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Transaction Type</label>
              <div className="font-medium">Fulfillment</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Reference ID</label>
              <div className="font-medium">demo-ob-b2c-009</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Task ID</label>
              <div className="font-medium">870</div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Customer</label>
              <div className="font-medium">Blue Flag</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Order Type</label>
              <div className="font-medium">B2C</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Receipt Advice Number</label>
              <div className="font-medium">-</div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Created By</label>
              <div className="font-medium">Admin User 2</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Type</label>
              <div className="font-medium">Outbound</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">PO Number</label>
              <div className="font-medium">-</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
