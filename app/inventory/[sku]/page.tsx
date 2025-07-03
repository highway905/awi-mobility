import { Suspense } from "react"
import { InventoryDetailsPageContent } from "@/features/inventory/components/inventory-details-page-content"
import AuthGuard from "@/routes/AuthGuard"

interface InventoryDetailsPageProps {
  params: {
    sku: string
  }
}

export default function InventoryDetailsPage({ params }: InventoryDetailsPageProps) {
  console.log("InventoryDetailsPage", params)
  return (
    <Suspense fallback={<></>}>
      <AuthGuard>
        <InventoryDetailsPageContent />
      </AuthGuard>
    </Suspense>
  )
}
