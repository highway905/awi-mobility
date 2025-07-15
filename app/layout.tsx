import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/lib/redux/provider"
import ErrorBoundary from "@/components/error-boundary"
import PWAInstaller from "@/components/pwa-installer"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AWI - Warehouse Management System",
  description: "Advanced warehouse management system for inventory and shipping",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["warehouse", "management", "inventory", "shipping", "logistics", "PWA"],
  authors: [{ name: "AWI Team" }],
  creator: "AWI Team",
  publisher: "AWI",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon/favicon-32x32.png",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AWI",
    startupImage: "/favicon/apple-touch-icon.png",
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'AWI',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ReduxProvider>
            <PWAInstaller />
            {children}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}