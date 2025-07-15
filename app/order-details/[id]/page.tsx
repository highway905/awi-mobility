import { Suspense } from "react"
import { OrderDetailsPageContent } from "@/features/order-details/components/order-details-page-content"
import { OrderDetailsPageSkeleton } from "@/features/order-details/components/order-details-page-skeleton"

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
