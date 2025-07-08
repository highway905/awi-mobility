"use client"

import { PageHeader } from "@/features/shared/components/page-header"

interface OrderStatusBadgeProps {
  type: string
  status: string
  className?: string
}

function OrderStatusBadge({ type, status, className }: OrderStatusBadgeProps) {
  const getColorsByType = (type: string) => {
    switch (type) {
      case "orderType":
        return "bg-blue-100 text-blue-800"
      case "status":
        return "bg-orange-100 text-orange-800"
      case "shippingStatus":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <span 
      className={`px-2 py-1 text-xs font-medium rounded-full ${getColorsByType(type)} ${className || ''}`}
    >
      {status}
    </span>
  )
}

interface OrderDetailsHeaderProps {
  orderId: string
  orderType: string
  status: string
  shippingStatus: string
  breadcrumbItems: Array<{ label: string; href?: string }>
  onMenuClick: () => void
}

export function OrderDetailsHeader({
  orderId,
  orderType,
  status,
  shippingStatus,
  breadcrumbItems,
  onMenuClick
}: OrderDetailsHeaderProps) {
  return (
    <PageHeader
      title={
        <div className="flex items-center gap-3">
          <span>{orderId}</span>
          <div className="flex gap-2">
            <OrderStatusBadge type="orderType" status={orderType} />
            <OrderStatusBadge type="status" status={status} />
            <OrderStatusBadge type="shippingStatus" status={shippingStatus} />
          </div>
        </div>
      }
      breadcrumbItems={breadcrumbItems}
      onMenuClick={onMenuClick}
    />
  )
}
