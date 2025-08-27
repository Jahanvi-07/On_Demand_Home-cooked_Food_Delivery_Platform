"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ChefHat, ShoppingBag, DollarSign, Check, X, Eye } from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalChefs: number
  totalOrders: number
  totalRevenue: number
}

interface User {
  id: string
  name: string
  email: string
  role: "user" | "chef"
  status: "active" | "suspended"
  joinDate: string
}

interface Order {
  id: string
  customerName: string
  chefName: string
  items: number
  total: number
  status: "pending" | "preparing" | "delivered"
  date: string
}

interface Meal {
  id: string
  name: string
  chefName: string
  price: number
  status: "pending" | "approved" | "rejected"
  cuisine: string
  submittedDate: string
}

const mockStats: AdminStats = {
  totalUsers: 1247,
  totalChefs: 89,
  totalOrders: 3456,
  totalRevenue: 45678.9,
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "chef",
    status: "active",
    joinDate: "2024-01-10",
  },
  {
    id: "3",
    name: "Maria Rossi",
    email: "maria@example.com",
    role: "chef",
    status: "suspended",
    joinDate: "2024-01-08",
  },
]

const mockOrders: Order[] = [
  {
    id: "ORD001",
    customerName: "John Doe",
    chefName: "Priya Sharma",
    items: 2,
    total: 31.98,
    status: "delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    chefName: "Maria Rossi",
    items: 1,
    total: 18.5,
    status: "preparing",
    date: "2024-01-15",
  },
]

const mockMeals: Meal[] = [
  {
    id: "1",
    name: "Spicy Thai Curry",
    chefName: "Somchai Wong",
    price: 16.99,
    status: "pending",
    cuisine: "Thai",
    submittedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Homemade Pizza",
    chefName: "Giuseppe Romano",
    price: 22.5,
    status: "pending",
    cuisine: "Italian",
    submittedDate: "2024-01-14",
  },
]

export default function AdminPanel() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>(mockStats)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [meals, setMeals] = useState<Meal[]>(mockMeals)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const handleUserStatusToggle = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user,
      ),
    )
  }

  const handleMealApproval = (mealId: string, status: "approved" | "rejected") => {
    setMeals((prev) => prev.map((meal) => (meal.id === mealId ? { ...meal, status } : meal)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, orders, and platform content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ChefHat className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Chefs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalChefs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="meals">Meal Approvals</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "chef" ? "default" : "secondary"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleUserStatusToggle(user.id)}>
                              {user.status === "active" ? "Suspend" : "Activate"}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Chef</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.chefName}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>₹{order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "preparing"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meal Approvals Tab */}
          <TabsContent value="meals">
            <Card>
              <CardHeader>
                <CardTitle>Meal Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meal Name</TableHead>
                      <TableHead>Chef</TableHead>
                      <TableHead>Cuisine</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meals.map((meal) => (
                      <TableRow key={meal.id}>
                        <TableCell className="font-medium">{meal.name}</TableCell>
                        <TableCell>{meal.chefName}</TableCell>
                        <TableCell>{meal.cuisine}</TableCell>
                        <TableCell>₹{meal.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              meal.status === "approved"
                                ? "default"
                                : meal.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {meal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(meal.submittedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {meal.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMealApproval(meal.id, "approved")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMealApproval(meal.id, "rejected")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <Button variant="outline" size="sm" className="ml-2 bg-transparent">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-bold">₹12,345</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Month</span>
                      <span className="font-bold">₹10,987</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth</span>
                      <span className="font-bold text-green-600">+12.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Cuisines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>North Indian</span>
                      <span className="font-bold">34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>South Indian</span>
                      <span className="font-bold">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gujarati</span>
                      <span className="font-bold">18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Others</span>
                      <span className="font-bold">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
