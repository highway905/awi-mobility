import React from "react"

interface ErrorAlertProps {
  message: string
  onClose?: () => void
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div
      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
