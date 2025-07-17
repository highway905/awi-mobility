"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TabContentWrapperProps {
  children: ReactNode
  title?: string
  actions?: ReactNode
  className?: string
  hasCard?: boolean
  hasPadding?: boolean
}

export function TabContentWrapper({ 
  children, 
  title, 
  actions, 
  className,
  hasCard = true,
  hasPadding = true 
}: TabContentWrapperProps) {
  if (!hasCard) {
    return (
      <div className={cn(
        "h-full flex flex-col",
        hasPadding && "p-6",
        className
      )}>
        {(title || actions) && (
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            {title && <h3 className="text-xl font-semibold">{title}</h3>}
            {actions && <div>{actions}</div>}
          </div>
        )}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("h-full flex flex-col border rounded-md", className)}>
      {(title || actions) && (
        <CardHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            {title && <CardTitle className="text-xl font-semibold">{title}</CardTitle>}
            {actions && <div>{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(
        "flex-1 overflow-auto border-none ",
        hasPadding ? "p-4" : "p-0"
      )}>
        {children}
      </CardContent>
    </Card>
  )
}
