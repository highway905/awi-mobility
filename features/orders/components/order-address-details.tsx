"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderAddressDetailsProps {
  orderId: string
}

export function OrderAddressDetails({ orderId }: OrderAddressDetailsProps) {
  return (
    <Card className="mx-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Address Details</CardTitle>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* From Address */}
          <div>
            <h4 className="text-sm text-gray-500 mb-3">From</h4>
            <div className="space-y-1">
              <div className="font-semibold">ABISEC</div>
              <div>ABISEC C/o Blue Flag</div>
              <div>Advanced Warehouse - SEC</div>
              <div>7 ABC Ave.</div>
              <div>Suite 1</div>
              <div>Secaucus, New Jersey, 07094</div>
              <div>United States</div>
            </div>
          </div>

          {/* To Address */}
          <div>
            <h4 className="text-sm text-gray-500 mb-3">To</h4>
            <div className="space-y-1">
              <div className="font-semibold">Blue Flag</div>
              <div>Blue Flag</div>
              <div>lane-01</div>
              <div>Los Angeles, California, 90001</div>
              <div>United States</div>
              <div className="text-sm text-gray-500 mt-2">2/13/2025 12:10 PM</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
