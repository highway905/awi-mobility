"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface NoDataProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

// Default icon for No Data state - matches the provided design
const DefaultNoDataIcon = () => (
  <div className="relative">
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-300"
    >
      {/* Folder/Document icon */}
      <path 
        d="M8 10C8 8.89543 8.89543 8 10 8H18L22 12H38C39.1046 12 40 12.8954 40 14V34C40 35.1046 39.1046 36 38 36H10C8.89543 36 8 35.1046 8 34V10Z" 
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* X mark to indicate no data */}
      <line x1="18" y1="20" x2="30" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="30" y1="20" x2="18" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
)

export function NoData({ 
  title = "No data available", 
  description, 
  icon, 
  className,
  size = "md" 
}: NoDataProps) {
  const sizeClasses = {
    sm: "py-6",
    md: "py-12",
    lg: "py-16"
  }

  const iconSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }

  const titleSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  const descriptionSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      sizeClasses[size],
      className
    )}>
      <div className={cn("mb-3", iconSizes[size])}>
        {icon || <DefaultNoDataIcon />}
      </div>
      <h3 className={cn(
        "font-medium text-gray-500",
        titleSizes[size]
      )}>
        {title}
      </h3>
      {description && (
        <p className={cn(
          "text-gray-400 max-w-sm mt-1",
          descriptionSizes[size]
        )}>
          {description}
        </p>
      )}
    </div>
  )
}

// Predefined icons for different contexts
export const NoDataIcons = {
  table: () => <DefaultNoDataIcon />,
  
  tasks: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-300">
      <rect x="8" y="6" width="32" height="36" rx="3" fill="currentColor" stroke="currentColor"/>
      <circle cx="14" cy="15" r="1.5" fill="white"/>
      <line x1="18" y1="15" x2="34" y2="15" stroke="white" strokeWidth="1.5"/>
      <circle cx="14" cy="24" r="1.5" fill="white"/>
      <line x1="18" y1="24" x2="34" y2="24" stroke="white" strokeWidth="1.5"/>
      <circle cx="14" cy="33" r="1.5" fill="white"/>
      <line x1="18" y1="33" x2="34" y2="33" stroke="white" strokeWidth="1.5"/>
      {/* X mark */}
      <line x1="16" y1="16" x2="32" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="16" x2="16" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  
  attachments: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-300">
      <path d="M12 6h24l6 6v30a3 3 0 01-3 3H12a3 3 0 01-3-3V9a3 3 0 013-3z" fill="currentColor"/>
      <path d="M36 6v6h6" stroke="white" strokeWidth="1.5" fill="none"/>
      <line x1="16" y1="21" x2="32" y2="21" stroke="white" strokeWidth="1.5"/>
      <line x1="16" y1="27" x2="32" y2="27" stroke="white" strokeWidth="1.5"/>
      <line x1="16" y1="33" x2="24" y2="33" stroke="white" strokeWidth="1.5"/>
      {/* X mark */}
      <line x1="18" y1="18" x2="30" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="30" y1="18" x2="18" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  
  shipping: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-300">
      <rect x="6" y="18" width="24" height="15" rx="1.5" fill="currentColor"/>
      <rect x="27" y="21" width="12" height="12" rx="1.5" fill="currentColor"/>
      <circle cx="13" cy="39" r="4.5" fill="currentColor"/>
      <circle cx="34" cy="39" r="4.5" fill="currentColor"/>
      <circle cx="13" cy="39" r="2.25" fill="white"/>
      <circle cx="34" cy="39" r="2.25" fill="white"/>
      {/* X mark */}
      <line x1="14" y1="16" x2="26" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="16" x2="14" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  
  pricing: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-300">
      <rect x="9" y="12" width="30" height="24" rx="3" fill="currentColor"/>
      <circle cx="24" cy="24" r="6" fill="white"/>
      <text x="24" y="27" textAnchor="middle" className="text-xs font-bold" fill="currentColor">$</text>
      {/* X mark */}
      <line x1="16" y1="16" x2="32" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="16" x2="16" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
