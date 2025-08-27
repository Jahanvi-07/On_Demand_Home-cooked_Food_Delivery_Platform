"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [deliveryMode, setDeliveryMode] = useState("delivery")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  // ✅ Client-side redirect
  useEffect(() => {
    if (!user || user.role !== "user") {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user || user.role !== "user") {
    return null
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some meals to your cart before checkout",
        variant: "destructive",
      })
      return
    }

    if (deliveryMode === "delivery" && !address) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address",
        variant: "destructive",
      })
      return
    }

    if (!phone) {
      toast({
        title: "Phone required",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return
    }

    // Simulate order placement
    const orderId = Math.random().toString(36).substr(2, 9)
    clearCart()

    toast({
      title: "Order placed successfully!",
      description: `Your order #${orderId} has been placed and is being prepared.`,
    })

    router.push(`/orders/${orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Discover delicious homemade meals from local chefs</p>
            <Button onClick={() => router.push("/")} size="lg">
              Browse Meals
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">by {item.chefName}</p>
                      <p className="font-bold text-orange-500">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Delivery Mode */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Delivery Mode</Label>
                  <RadioGroup value={deliveryMode} onValueChange={setDeliveryMode}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Home Delivery (+₹29)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Pickup (Free)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Address */}
                {deliveryMode === "delivery" && (
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                )}

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  {deliveryMode === "delivery" && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹29</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{(total * 0.18).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ₹{(total + (deliveryMode === "delivery" ? 29 : 0) + total * 0.18).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
