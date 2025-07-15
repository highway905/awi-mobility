"use client"

import type React from "react"

import { ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string | React.ReactNode
  breadcrumbItems: BreadcrumbItem[]
  filterValue?: string
  filterOptions?: { value: string; label: string }[]
  onFilterChange?: (value: string) => void
  onMenuClick?: () => void
  showSearch?: boolean
  searchValue?: string
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  breadcrumbItems,
  filterValue,
  filterOptions = [],
  onFilterChange,
  onMenuClick,
  showSearch = false,
  searchValue = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  actions,
}: PageHeaderProps) {
  return (
    <div className="h-header">
      {/* Breadcrumb Section */}
      <div className="h-breadcrumb flex items-center gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="p-1 h-6 w-6 hover:bg-gray-100">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 0.999995C0 0.631805 0.298477 0.333328 0.666667 0.333328H11.3333C11.7015 0.333328 12 0.631805 12 0.999995C12 1.36818 11.7015 1.66666 11.3333 1.66666H0.666667C0.298477 1.66666 0 1.36818 0 0.999995ZM0 5C0 4.63181 0.298477 4.33333 0.666667 4.33333H11.3333C11.7015 4.33333 12 4.63181 12 5C12 5.36819 11.7015 5.66666 11.3333 5.66666H0.666667C0.298477 5.66666 0 5.36819 0 5ZM0.666667 8.33333C0.298477 8.33333 0 8.63181 0 9C0 9.36819 0.298477 9.66666 0.666667 9.66666H11.3333C11.7015 9.66666 12 9.36819 12 9C12 8.63181 11.7015 8.33333 11.3333 8.33333H0.666667Z"
                fill="#0C0A09"
              />
            </svg>
          </Button>
        )}
        <nav className="flex items-center gap-1 text-sm text-gray-600">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3" />}
              {item.href ? (
                <a href={item.href} className="hover:text-gray-900">
                  {item.label}
                </a>
              ) : (
                <span className={index === breadcrumbItems.length - 1 ? "text-gray-900 font-medium" : ""}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Title and Actions Section */}
      <div className="h-title-filter flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          {actions}
        </div>
      </div>
    </div>
  )
}
