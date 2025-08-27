"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Truck, ChefHat } from "lucide-react"

interface OrderStatus {
  status: "pending" | "preparing" | "ready" | "delivered"
  timestamp: string
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  chefName: string
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  deliveryMode: "delivery" | "pickup"
  address?: string
  phone: string
  createdAt: string
  statusHistory: OrderStatus[]
}

const mockOrder: Order = {
  id: "abc123def",
  items: [
    {
      id: "1",
      name: "Homemade Butter Chicken",
      quantity: 2,
      price: 15.99,
      chefName: "Priya Sharma",
    },
    {
      id: "2",
      name: "Grandma's Lasagna",
      quantity: 1,
      price: 18.5,
      chefName: "Maria Rossi",
    },
  ],
  total: 53.47,
  deliveryMode: "delivery",
  address: "123 Main St, Downtown",
  phone: "+1 (555) 123-4567",
  createdAt: "2024-01-15T10:30:00Z",
  statusHistory: [
    { status: "pending", timestamp: "2024-01-15T10:30:00Z" },
    { status: "preparing", timestamp: "2024-01-15T10:35:00Z" },
    { status: "ready", timestamp: "2024-01-15T11:15:00Z" },
  ],
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order>(mockOrder)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const currentStatus = order.statusHistory[order.statusHistory.length - 1]?.status || "pending"

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "preparing":
        return <ChefHat className="h-5 w-5 text-blue-500" />
      case "ready":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "delivered":
        return <Truck className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Received"
      case "preparing":
        return "Being Prepared"
      case "ready":
        return order.deliveryMode === "delivery" ? "Out for Delivery" : "Ready for Pickup"
      case "delivered":
        return order.deliveryMode === "delivery" ? "Delivered" : "Picked Up"
      default:
        return "Unknown"
    }
  }

  const statusSteps = ["pending", "preparing", "ready", "delivered"]
  const currentStepIndex = statusSteps.indexOf(currentStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
          <p className="text-gray-600">Order #{order.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getStatusIcon(currentStatus)}
                  <span className="ml-2">{getStatusText(currentStatus)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Status Timeline */}
                <div className="space-y-4">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex
                    const statusData = order.statusHistory.find((s) => s.status === step)

                    return (
                      <div key={step} className="flex items-center">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-current" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div
                            className={`font-medium ${isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"}`}
                          >
                            {getStatusText(step)}
                          </div>
                          {statusData && (
                            <div className="text-sm text-gray-500">
                              {new Date(statusData.timestamp).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {currentStatus === "ready" && order.deliveryMode === "pickup" && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Ready for Pickup!</h4>
                    <p className="text-blue-700 text-sm">
                      Your order is ready for pickup. Please contact the chef to arrange pickup.
                    </p>
                  </div>
                )}

                {currentStatus === "delivered" && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Order Complete!</h4>
                    <p className="text-green-700 text-sm">Thank you for your order. We hope you enjoyed your meal!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">by {item.chefName}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ₹{item.price} × {item.quantity}
                        </div>
                        <div className="text-sm text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ₹{(order.total - (order.deliveryMode === "delivery" ? 29 : 0) - order.total * 0.18).toFixed(2)}
                  </span>
                </div>
                {order.deliveryMode === "delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹29</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{(order.total * 0.18).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Mode: </span>
                  <Badge variant={order.deliveryMode === "delivery" ? "default" : "secondary"}>
                    {order.deliveryMode === "delivery" ? "Home Delivery" : "Pickup"}
                  </Badge>
                </div>
                {order.address && (
                  <div>
                    <span className="font-medium">Address: </span>
                    <span className="text-gray-600">{order.address}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Phone: </span>
                  <span className="text-gray-600">{order.phone}</span>
                </div>
                <div>
                  <span className="font-medium">Order Time: </span>
                  <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 space-y-3">
              <Button onClick={() => router.push("/")} className="w-full">
                Order Again
              </Button>
              <Button variant="outline" onClick={() => router.push("/orders")} className="w-full">
                View All Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
