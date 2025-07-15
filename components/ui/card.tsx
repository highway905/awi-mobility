import React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("border border-dashboard-border bg-white rounded-dashboard", className)} 
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("p-4 pb-2", className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("p-4 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-sm font-medium text-gray-900", className)} {...props}>
      {children}
    </h3>
  )
}
