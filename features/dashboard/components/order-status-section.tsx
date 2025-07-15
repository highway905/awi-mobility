"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderStatusCard } from "./order-status-card"
import { outboundOrderData, inboundOrderData } from "../mocks/dashboard-data"

export function OrderStatusSection() {
  const [activeTab, setActiveTab] = useState("outbound")

  const currentData = activeTab === "outbound" ? outboundOrderData : inboundOrderData

  return (
    <Card className="h-order-status">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Order Status</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="outbound">Outbound</TabsTrigger>
              <TabsTrigger value="inbound">Inbound</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-dashboard-gap">
          {currentData.map((item, index) => (
            <OrderStatusCard
              key={index}
              title={item.title}
              value={item.value}
              variant={item.variant}
              className="flex-1"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
