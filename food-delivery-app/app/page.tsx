"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { MealCard } from "@/components/meal-card"
import { SearchFilters } from "@/components/search-filters"
import { PWAInstall } from "@/components/pwa-install"
import { useMeals } from "@/contexts/meals-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

export default function HomePage() {
  const { meals } = useMeals()
  const [filteredMeals, setFilteredMeals] = useState(meals)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  useEffect(() => {
    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    }
  }, [])

  useEffect(() => {
    let filtered = meals.filter((meal) => meal.available) // Only show available meals

    if (searchQuery) {
      filtered = filtered.filter(
        (meal) =>
          meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.chefName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCuisine) {
      filtered = filtered.filter((meal) => meal.cuisine === selectedCuisine)
    }

    if (selectedLocation) {
      filtered = filtered.filter((meal) => meal.location === selectedLocation)
    }

    setFilteredMeals(filtered)
  }, [meals, searchQuery, selectedCuisine, selectedLocation])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Ghar Ka Khana</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover authentic homemade Indian meals from local home chefs
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for meals, chefs, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-gray-900"
              />
            </div>
            <Button size="lg" variant="secondary" className="h-12 px-8">
              <MapPin className="mr-2 h-5 w-5" />
              Near Me
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <SearchFilters
              selectedCuisine={selectedCuisine}
              selectedLocation={selectedLocation}
              onCuisineChange={setSelectedCuisine}
              onLocationChange={setSelectedLocation}
            />
          </div>

          {/* Meals Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Meals ({filteredMeals.length})</h2>
            </div>

            {filteredMeals.length === 0 ? (
              <div className="text-center py-12">
                {meals.length === 0 ? (
                  <>
                    <p className="text-gray-500 text-lg">No meals available yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Be the first chef to add delicious homemade meals!</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg">No meals found matching your criteria.</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstall />
    </div>
  )
}
