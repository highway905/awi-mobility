"use client"
// import { LayoutDashboard, CheckSquare, Package, Archive, Settings, Truck, Bell, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { icon: "LayoutDashboard", label: "Dashboard", href: "/dashboard", active: false },
  { icon: "Package", label: "Orders", href: "/orders", active: false },
  // { icon: "FileText", label: "Order Details", href: "/order-details", active: false },
  { icon: "CheckSquare", label: "Tasks", href: "/tasks", active: false },
  { icon: "Archive", label: "Inventory", href: "/inventory", active: false },
  // { icon: "Settings", label: "Masters", href: "/masters", active: false },
  { icon: "Truck", label: "Shipping", href: "/shipping", active: false },
]

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "LayoutDashboard":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3.5H19C19.8239 3.5 20.5 4.17614 20.5 5V19C20.5 19.8239 19.8239 20.5 19 20.5H5C4.17614 20.5 3.5 19.8239 3.5 19V5C3.5 4.17614 4.17614 3.5 5 3.5ZM4.5 19.5H11.5V4.5H4.5V19.5ZM12.5 19.5H19.5V11.5H12.5V19.5ZM12.5 10.5H19.5V4.5H12.5V10.5Z" fill="currentColor" stroke="currentColor"/>
        </svg>
      );
    case "Package":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 12C2 7.286 2 4.929 3.464 3.464C4.93 2 7.286 2 12 2C16.714 2 19.071 2 20.535 3.464C22 4.93 22 7.286 22 12C22 16.714 22 19.071 20.535 20.535C19.072 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.072 2 16.714 2 12Z" stroke="#78716C" strokeWidth="1.5"/>
<path d="M6 15.8L7.143 17L10 14M6 8.8L7.143 10L10 7" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13 9H18M13 16H18" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
      )
    
    case "CheckSquare":
      return (
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.79268 11.53C2.32968 8.842 2.59868 7.5 3.48568 6.634C3.64961 6.47444 3.82693 6.32924 4.01568 6.2C5.03868 5.5 6.40868 5.5 9.14868 5.5H10.8517C13.5907 5.5 14.9597 5.5 15.9817 6.2C16.1717 6.33067 16.3483 6.47567 16.5117 6.635C17.3987 7.5 17.6687 8.843 18.2057 11.53C18.9767 15.386 19.3627 17.314 18.4747 18.68C18.314 18.9287 18.1273 19.1563 17.9147 19.363C16.7487 20.5 14.7837 20.5 10.8517 20.5H9.14868C5.21568 20.5 3.24968 20.5 2.08368 19.362C1.87272 19.1556 1.68525 18.9266 1.52468 18.679C0.636681 17.313 1.02268 15.385 1.79468 11.529L1.79268 11.53Z" stroke="#78716C" strokeWidth="1.5"/>
<path d="M12.999 9.5C13.5513 9.5 13.999 9.05228 13.999 8.5C13.999 7.94772 13.5513 7.5 12.999 7.5C12.4467 7.5 11.999 7.94772 11.999 8.5C11.999 9.05228 12.4467 9.5 12.999 9.5Z" fill="#78716C"/>
<path d="M6.99902 9.5C7.55131 9.5 7.99902 9.05228 7.99902 8.5C7.99902 7.94772 7.55131 7.5 6.99902 7.5C6.44674 7.5 5.99902 7.94772 5.99902 8.5C5.99902 9.05228 6.44674 9.5 6.99902 9.5Z" fill="#78716C"/>
<path d="M6.99902 5.5V4.5C6.99902 3.70435 7.31509 2.94129 7.8777 2.37868C8.44031 1.81607 9.20337 1.5 9.99902 1.5C10.7947 1.5 11.5577 1.81607 12.1203 2.37868C12.683 2.94129 12.999 3.70435 12.999 4.5V5.5" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
      )
    case "Archive":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 4.00098C18.175 4.01298 19.353 4.10998 20.121 4.87798C21 5.75698 21 7.17098 21 9.99898V15.999C21 18.828 21 20.242 20.121 21.121C19.243 21.999 17.828 21.999 15 21.999H9C6.172 21.999 4.757 21.999 3.879 21.121C3 20.241 3 18.828 3 15.999V9.99898C3 7.17098 3 5.75698 3.879 4.87798C4.647 4.10998 5.825 4.01298 8 4.00098" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M9 13.401L10.714 15.001L15 11.001" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8 3.50098C8 3.10315 8.15804 2.72162 8.43934 2.44032C8.72064 2.15901 9.10218 2.00098 9.5 2.00098H14.5C14.8978 2.00098 15.2794 2.15901 15.5607 2.44032C15.842 2.72162 16 3.10315 16 3.50098V4.50098C16 4.8988 15.842 5.28033 15.5607 5.56164C15.2794 5.84294 14.8978 6.00098 14.5 6.00098H9.5C9.10218 6.00098 8.72064 5.84294 8.43934 5.56164C8.15804 5.28033 8 4.8988 8 4.50098V3.50098Z" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
      ) 

    case "Truck":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_2224_12362" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="20">
<path d="M22 2H2V22H22V2Z" fill="white"/>
</mask>
<g mask="url(#mask0_2224_12362)">
<path fillRule="evenodd" clipRule="evenodd" d="M9.92355 14.9721H16.0228C16.7134 12.9389 19.595 12.9584 20.2789 14.9721H20.7886V12.0413C20.7886 11.6762 20.4893 11.377 20.1243 11.377C18.6264 11.377 17.1284 11.377 15.6305 11.377C15.3067 11.377 15.0442 11.1145 15.0442 10.7909V7.2739H5.00152V7.97717H6.07925C6.85088 7.97717 6.85088 9.1495 6.07925 9.1495H5.00152V10.2828H7.81509C8.58688 10.2828 8.58688 11.4551 7.81509 11.4551H5.00152V14.972H5.66757C6.35803 12.9387 9.2398 12.9586 9.92355 14.9721ZM3.82918 9.1495H3.12591C2.35412 9.1495 2.35412 7.97717 3.12591 7.97717H3.82918V6.68765C3.82918 6.36401 4.09164 6.10156 4.41543 6.10156C5.31249 6.10156 15.1713 6.10537 15.1713 6.10156C16.776 6.10156 18.1737 6.89593 18.9962 8.27609L20.1454 10.2048C21.1484 10.2161 21.9609 11.0366 21.9609 12.0412V15.5582C21.9609 15.8818 21.6985 16.1443 21.3748 16.1443H20.3529C20.1428 17.1788 19.2287 17.9417 18.1509 17.9417C17.0732 17.9417 16.1591 17.1788 15.9489 16.1443H9.99756C9.78744 17.1788 8.87328 17.9417 7.79556 17.9417C6.71783 17.9417 5.80367 17.1788 5.59356 16.1443H4.41543C4.09164 16.1443 3.82918 15.8818 3.82918 15.5582V13.7997H2.53967C1.76803 13.7997 1.76803 12.6274 2.53967 12.6274H3.82918V11.4551H2.53967C1.76803 11.4551 1.76803 10.2828 2.53967 10.2828H3.82918V9.1495ZM18.9108 14.935C19.3304 15.3547 19.3304 16.0352 18.9108 16.4548C18.2357 17.1298 17.0762 16.6497 17.0762 15.6949C17.0762 14.7402 18.2357 14.26 18.9108 14.935ZM18.7849 10.2046H16.2166V7.43274C16.9644 7.67245 17.576 8.17569 17.9932 8.87591L18.7849 10.2046ZM8.55545 14.935C8.97507 15.3547 8.97507 16.0352 8.55545 16.4548C7.8804 17.1298 6.72088 16.6497 6.72088 15.6949C6.72103 14.7402 7.8804 14.26 8.55545 14.935Z" fill="#78716C"/>
</g>
</svg>
      )

    default:
      return <div className="w-5 h-5 bg-gray-400 rounded" />;
  }
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {

  const handleLogout = async () => {
    try {
      // TODO: Implement logout functionality
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error('Logout error:', error);
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
                    "flex flex-col items-center justify-center w-14 h-10 rounded text-sm font-medium transition-colors",
                    item.active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                  onClick={onClose}
                >
                  {getIcon(item.icon)}
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
            <div className="relative w-14 h-10 flex items-center justify-center rounded hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 bg-gray-400 rounded" />
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
