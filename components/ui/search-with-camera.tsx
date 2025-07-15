"use client"

import { useState } from "react"
import { Input } from "./input"
import { Search, Camera } from "lucide-react"

interface SearchWithCameraProps {
  placeholder?: string
  width?: string
  height?: string
  onSearch?: (value: string) => void
  onCamera?: () => void
  showCamera?: boolean
  className?: string
}

export function SearchWithCamera({
  placeholder = "Search...",
  width = "300px",
  height = "36px",
  onSearch,
  onCamera,
  showCamera = true,
  className = "",
}: SearchWithCameraProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleCameraClick = () => {
    if (onCamera) {
      onCamera()
    } else {
      // Default camera action if no handler is provided
      console.log("Camera button clicked. Implement camera functionality.")
      // In a real implementation, this would trigger camera or barcode scanning
    }
  }

  return (
    <div className={`relative ${className}`} style={{ width }}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        placeholder={placeholder}
        className="pl-10 pr-10 w-full"
        value={searchValue}
        onChange={handleSearchChange}
        style={{ height }}
      />
      {showCamera && (
        <button 
          onClick={handleCameraClick} 
          title="Scan barcode"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900"
          type="button"
        >
          <Camera className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
