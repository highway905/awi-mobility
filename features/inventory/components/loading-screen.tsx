import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export function LoadingScreen({ message = "Loading...", fullScreen = false, className = "" }: LoadingScreenProps) {
  const containerClass = fullScreen ? "h-screen flex flex-col bg-gray-50" : "h-full flex items-center justify-center"

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex items-center justify-center">
        <div className="text-gray-500 flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  )
}
