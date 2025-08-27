"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { useMeals } from "@/contexts/meals-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, DollarSign, Clock, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Add this interface for orders
interface ChefOrder {
  id: string
  customerName: string
  mealName: string
  quantity: number
  price: number
  total: number
  date: string
  status: "pending" | "preparing" | "completed" | "cancelled"
}

export default function ChefDashboard() {
  const { user } = useAuth()
  const { getMealsByChef, addMeal, updateMeal, deleteMeal } = useMeals()
  const router = useRouter()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<any>(null)
  // Add orders state (empty for now)
  const [orders, setOrders] = useState<ChefOrder[]>([])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    cuisine: "",
    prepTime: "",
    image: "",
    location: "",
  })

  useEffect(() => {
    if (!user || user.role !== "chef") {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user || user.role !== "chef") {
    return null
  }

  // Get meals for this chef
  const chefMeals = getMealsByChef(user.id)

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      cuisine: "",
      prepTime: "",
      image: "",
      location: "",
    })
  }

  const handleAddMeal = () => {
    if (!formData.name || !formData.description || !formData.price || !formData.cuisine || !formData.location) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    addMeal({
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      image: formData.image || "/placeholder.svg?height=200&width=300",
      chefName: user.name,
      chefId: user.id,
      cuisine: formData.cuisine,
      prepTime: formData.prepTime || "30 mins",
      available: true,
      location: formData.location,
    })

    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "Meal added successfully!",
      description: `${formData.name} has been added to your menu and is now visible to customers`,
    })
  }

  const handleEditMeal = (meal: any) => {
    setEditingMeal(meal)
    setFormData({
      name: meal.name,
      description: meal.description,
      price: meal.price.toString(),
      cuisine: meal.cuisine,
      prepTime: meal.prepTime,
      image: meal.image,
      location: meal.location,
    })
  }

  const handleUpdateMeal = () => {
    if (!editingMeal) return

    updateMeal(editingMeal.id, {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      cuisine: formData.cuisine,
      prepTime: formData.prepTime,
      image: formData.image,
      location: formData.location,
    })

    resetForm()
    setEditingMeal(null)

    toast({
      title: "Meal updated successfully!",
      description: "Your meal has been updated and changes are visible to customers",
    })
  }

  const handleDeleteMeal = (id: string) => {
    deleteMeal(id)
    toast({
      title: "Meal deleted",
      description: "The meal has been removed from your menu and is no longer visible to customers",
    })
  }

  const toggleAvailability = (id: string) => {
    const meal = chefMeals.find((m) => m.id === id)
    if (meal) {
      updateMeal(id, { available: !meal.available })
      toast({
        title: meal.available ? "Meal marked unavailable" : "Meal marked available",
        description: meal.available
          ? "This meal is now hidden from customers"
          : "This meal is now visible to customers",
      })
    }
  }

  // Calculate actual revenue from completed orders
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0)

  const totalOrders = orders.filter((order) => order.status === "completed").length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chef Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add New Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Meal</DialogTitle>
                <DialogDescription>Create a new meal to add to your menu</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Meal Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Butter Chicken"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="299"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine *</Label>
                  <Select
                    value={formData.cuisine}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, cuisine: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North Indian">North Indian</SelectItem>
                      <SelectItem value="South Indian">South Indian</SelectItem>
                      <SelectItem value="Gujarati">Gujarati</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Maharashtrian">Maharashtrian</SelectItem>
                      <SelectItem value="Rajasthani">Rajasthani</SelectItem>
                      <SelectItem value="Street Food">Street Food</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Kolkata">Kolkata</SelectItem>
                      <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                      <SelectItem value="Jaipur">Jaipur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time</Label>
                  <Input
                    id="prepTime"
                    value={formData.prepTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prepTime: e.target.value }))}
                    placeholder="e.g., 30 mins"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your meal..."
                    rows={3}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMeal}>Add Meal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Meals</p>
                  <p className="text-2xl font-bold text-gray-900">{chefMeals.filter((m) => m.available).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {chefMeals.length > 0
                      ? (chefMeals.reduce((sum, meal) => sum + meal.rating, 0) / chefMeals.length).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meals List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Meals ({chefMeals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {chefMeals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No meals added yet</p>
                <p className="text-gray-400 text-sm mb-6">Add your first meal to start selling to customers</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Meal
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chefMeals.map((meal) => (
                  <Card key={meal.id} className="overflow-hidden">
                    <div className="relative">
                      <Image
                        src={meal.image || "/placeholder.svg"}
                        alt={meal.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className={`absolute top-2 right-2 ${meal.available ? "bg-green-500" : "bg-red-500"}`}>
                        {meal.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{meal.name}</h3>
                        <span className="font-bold text-orange-500">₹{meal.price}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{meal.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{meal.cuisine}</span>
                        <span>{meal.prepTime}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAvailability(meal.id)}
                          className="flex-1"
                        >
                          {meal.available ? "Mark Unavailable" : "Mark Available"}
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => handleEditMeal(meal)}>
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders yet</p>
                <p className="text-gray-400 text-sm mt-2">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{order.mealName}</h4>
                      <p className="text-sm text-gray-600">
                        {order.customerName} • Qty: {order.quantity}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{order.total}</p>
                      <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingMeal} onOpenChange={() => setEditingMeal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Meal</DialogTitle>
              <DialogDescription>Update your meal information</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Meal Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Butter Chicken"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="299"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cuisine">Cuisine *</Label>
                <Select
                  value={formData.cuisine}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, cuisine: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North Indian">North Indian</SelectItem>
                    <SelectItem value="South Indian">South Indian</SelectItem>
                    <SelectItem value="Gujarati">Gujarati</SelectItem>
                    <SelectItem value="Punjabi">Punjabi</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                    <SelectItem value="Maharashtrian">Maharashtrian</SelectItem>
                    <SelectItem value="Rajasthani">Rajasthani</SelectItem>
                    <SelectItem value="Street Food">Street Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="Jaipur">Jaipur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-prepTime">Prep Time</Label>
                <Input
                  id="edit-prepTime"
                  value={formData.prepTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, prepTime: e.target.value }))}
                  placeholder="e.g., 30 mins"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your meal..."
                  rows={3}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingMeal(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMeal}>Update Meal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
