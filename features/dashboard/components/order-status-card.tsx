import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface OrderStatusCardProps {
  title: string
  value: string | number
  variant?: "gray" | "yellow" | "purple" | "orange" | "green"
  className?: string
}

const variantStyles = {
  purple: "bg-purple-100 border-purple-200",
  pink: "bg-pink-100 border-pink-200",
  blue: "bg-blue-100 border-blue-200",
  orange: "bg-orange-100 border-orange-200",
  green: "bg-green-100 border-green-200",
}

export function OrderStatusCard({ title, value, variant = "purple", className }: OrderStatusCardProps) {
  return (
    <Card className={cn(
      "p-4 flex flex-col justify-center min-h-[88px] border-l-2",
      // Gray variant
      variant === "gray" && "bg-[#F5F5F5] border-[#BFBFBF]",
      // Yellow variant  
      variant === "yellow" && "bg-[#FFFBDD] border-[#FFFBDD]",
      // Purple variant
      variant === "purple" && "bg-[#EDF1FD] border-[#8192BF]", 
      // Orange variant
      variant === "orange" && "bg-[#FDF3ED] border-[#BF9A81]",
      // Green variant
      variant === "green" && "bg-[#E8F7F4] border-[#81BFAF]",
      className
    )} >
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </Card>
  )
}
