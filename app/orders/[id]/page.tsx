import { Suspense } from "react"
import { OrderDetailsPageContent } from "@/features/order-details/components/order-details-page-content"
import { GlobalLoader } from "@/components/shared"

interface OrderDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<GlobalLoader />}>
      <OrderDetailsPageContent orderId={id} />
    </Suspense>
  )
}
