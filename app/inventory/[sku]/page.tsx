import { Suspense } from "react"
import { InventoryDetailsPageContent } from "@/features/inventory/components/inventory-details-page-content"

interface InventoryDetailsPageProps {
  params: Promise<{
    sku: string
  }>
}

export default async function InventoryDetailsPage({ params }: InventoryDetailsPageProps) {
  const { sku } = await params
  console.log("InventoryDetailsPage", sku)
  return (
    <Suspense fallback={<></>}>
      <InventoryDetailsPageContent />
    </Suspense>
  )
}
