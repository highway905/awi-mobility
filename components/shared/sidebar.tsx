"use client"
import { LayoutDashboard, CheckSquare, Package, Archive, Settings, Truck, Bell, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useLogoutMutation } from "@/lib/redux/api/profile"
interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: false },
  { icon: Package, label: "Orders", href: "/orders", active: false },
  // { icon: FileText, label: "Order Details", href: "/order-details", active: false },
  { icon: CheckSquare, label: "Tasks", href: "/tasks", active: false },
  { icon: Archive, label: "Inventory", href: "/inventory", active: false },
  { icon: Settings, label: "Masters", href: "/masters", active: false },
  { icon: Truck, label: "Shipping", href: "/shipping", active: false },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {

  const [logout, getStatus] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const { data } = await logout();
      if (data?.response) {

        if (window) window.location.href = "/login";
      }
    } catch (error) {
      //
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={onClose} />}

      {/* Sidebar - 80px width, icon only, overlay */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-20 bg-white border-r border-dashboard-border z-50 transform transition-transform duration-300 ease-in-out shadow-lg flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center">
          <svg width="54" height="40" viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.2573 39.6042L0.5 35.2681V9.86168L26.2573 1.18896V39.6042Z" fill="#FCCC5D" />
            <path
              d="M1.98548 34.1941L26.2573 38.2798V1.87337L1.98548 10.0459V34.1941ZM27 39.9997C26.9614 39.9997 26.9228 39.9965 26.8842 39.9901L1.12687 35.6541C0.765902 35.5928 0.5 35.2616 0.5 34.8713V9.4648C0.5 9.11939 0.709948 8.81353 1.01893 8.70897L26.7762 0.036787C27.002 -0.0392754 27.2481 0.00403826 27.4392 0.153522C27.6304 0.302478 27.7428 0.540172 27.7428 0.792659V39.2073C27.7428 39.4392 27.6477 39.6595 27.4828 39.8095C27.3471 39.9331 27.1758 39.9997 27 39.9997Z"
              fill="#393536"
            />
            <path d="M52.7573 34.8711L27 39.2072V0.791992L52.7573 9.46471V34.8711Z" fill="#D48519" />
            <path
              d="M27.7424 1.87365V38.2801L52.0141 34.1944V10.0456L27.7424 1.87365ZM26.9996 39.9999C26.8238 39.9999 26.6525 39.9333 26.5168 39.8098C26.3519 39.6592 26.2568 39.439 26.2568 39.2076V0.792399C26.2568 0.539916 26.3692 0.302749 26.5604 0.153266C26.751 0.0043102 26.9976 -0.0384756 27.2234 0.0370586L52.9807 8.70924C53.2897 8.8133 53.4996 9.11967 53.4996 9.46507V34.8715C53.4996 35.2613 53.2337 35.5931 52.8728 35.6538L27.1155 39.9899C27.0768 39.9968 27.0382 39.9999 26.9996 39.9999Z"
              fill="#393536"
            />
            <path d="M9.55078 13.1369L17.2302 11.2607V20.8166L9.55078 21.5767V13.1369Z" fill="#393536" />
            <path d="M9.55078 24.5275L17.2302 24.0156V37.616L9.55078 36.1534V24.5275Z" fill="#393536" />
            <path d="M34.7148 3.32324V29.5146L38.6033 28.9219V4.89255L34.7148 3.32324Z" fill="#393536" />
            <path d="M44.6543 6.50977V28.3582L47.5906 28.0745V7.72571L44.6543 6.50977Z" fill="#393536" />
          </svg>
          
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-3">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-14 h-10 rounded-dashboard text-sm font-medium transition-colors",
                    item.active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section - Fixed at bottom */}
        <div className="p-3 space-y-3">
          {/* Notification */}
          <div className="flex items-center justify-center">
            <div className="relative w-14 h-10 flex items-center justify-center rounded-dashboard hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>

          {/* User Avatar */}
          <div className="flex items-center justify-center" onClick={handleLogout}>
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">😊</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
