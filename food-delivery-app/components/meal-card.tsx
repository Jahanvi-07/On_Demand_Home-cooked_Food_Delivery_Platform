"use client"

import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, Clock, MapPin, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Meal {
  id: string
  name: string
  description: string
  price: number
  image: string
  chefName: string
  chefId: string
  cuisine: string
  rating: number
  prepTime: string
  available: boolean
  location: string
}

interface MealCardProps {
  meal: Meal
}

export function MealCard({ meal }: MealCardProps) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to cart",
        variant: "destructive",
      })
      return
    }

    if (user.role !== "user") {
      toast({
        title: "Access denied",
        description: "Only users can add items to cart",
        variant: "destructive",
      })
      return
    }

    addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      image: meal.image,
      chefName: meal.chefName,
    })

    toast({
      title: "Added to cart",
      description: `${meal.name} has been added to your cart`,
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={meal.image || "/placeholder.svg"}
          alt={meal.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {!meal.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="secondary" className="text-white bg-red-500">
              Sold Out
            </Badge>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-orange-500">{meal.cuisine}</Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{meal.name}</h3>
          <span className="font-bold text-orange-500">₹{meal.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{meal.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{meal.rating}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{meal.prepTime}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{meal.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">by {meal.chefName}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!meal.available}
          className="w-full"
          variant={meal.available ? "default" : "secondary"}
        >
          <Plus className="h-4 w-4 mr-2" />
          {meal.available ? "Add to Cart" : "Sold Out"}
        </Button>
      </CardFooter>
    </Card>
  )
}
