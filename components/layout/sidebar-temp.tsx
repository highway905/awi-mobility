"use client"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function SidebarTemp({ isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 z-50 shadow-lg flex flex-col">
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center">
          <div className="w-8 h-8 bg-orange-400 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <div className="px-3 space-y-2">
            <button 
              onClick={onClose}
              className="w-14 h-10 flex flex-col items-center justify-center rounded text-gray-600 hover:bg-gray-50"
            >
              <span className="text-xs">Dashboard</span>
            </button>
            <button 
              onClick={onClose}
              className="w-14 h-10 flex flex-col items-center justify-center rounded text-gray-600 hover:bg-gray-50 bg-gray-100"
            >
              <span className="text-xs">Orders</span>
            </button>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-3">
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">👤</span>
          </div>
        </div>
      </div>
    </>
  )
}
