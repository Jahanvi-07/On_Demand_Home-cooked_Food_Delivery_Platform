import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { MealsProvider } from "@/contexts/meals-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GharKaKhana - Fresh Homemade Food Delivery",
  description: "Order fresh homemade meals from local home chefs across India",
  manifest: "/manifest.json",
  themeColor: "#f97316",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MealsProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </MealsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
