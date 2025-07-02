import { Suspense } from "react"
import { InventoryPageContent } from "@/features/inventory/components/inventory-page-content"
import { InventoryPageSkeleton } from "@/features/inventory/components/inventory-page-skeleton"
import AuthGuard from "@/routes/AuthGuard"

export default function InventoryPage() {
  return (
    <Suspense fallback={<></>}>
      <AuthGuard>
        <InventoryPageContent />
      </AuthGuard>
    </Suspense>
  )
}
