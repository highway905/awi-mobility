import { Suspense } from "react"
import { OrdersPageContent } from "@/features/orders/components/orders-page-content"
import { OrdersPageSkeleton } from "@/features/orders/components/orders-page-skeleton"
import AuthGuard from "@/routes/AuthGuard"

export default function OrdersPage() {
  return (
    <Suspense fallback={<></>}>
      <AuthGuard>
        <OrdersPageContent />
      </AuthGuard>
    </Suspense>
  )
}
