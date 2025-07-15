"use client"

import { Card } from "@/components/ui/card"
import { ReactNode } from "react"

interface TabContentWrapperProps {
  children: ReactNode
  title?: string
  actions?: ReactNode
}

export function TabContentWrapper({ children, title, actions }: TabContentWrapperProps) {
  return (
    <Card className="h-full flex flex-col">
      {(title || actions) && (
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          {title && <h3 className="font-medium">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </Card>
  )
}
