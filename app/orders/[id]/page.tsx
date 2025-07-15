import { Suspense } from "react"
import { OrderDetailsPageContent } from "@/features/orders/components/order-details-page-content"
import { OrderDetailsPageSkeleton } from "@/features/orders/components/order-details-page-skeleton"

interface OrderDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<OrderDetailsPageSkeleton />}>
      <OrderDetailsPageContent orderId={id} />
    </Suspense>
  )
}
