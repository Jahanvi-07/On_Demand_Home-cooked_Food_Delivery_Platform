"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

interface SearchFiltersProps {
  selectedCuisine: string
  selectedLocation: string
  onCuisineChange: (cuisine: string) => void
  onLocationChange: (location: string) => void
}

const cuisines = [
  "North Indian",
  "South Indian",
  "Gujarati",
  "Punjabi",
  "Bengali",
  "Maharashtrian",
  "Rajasthani",
  "Street Food",
]
const locations = ["Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"]

export function SearchFilters({
  selectedCuisine,
  selectedLocation,
  onCuisineChange,
  onLocationChange,
}: SearchFiltersProps) {
  const clearFilters = () => {
    onCuisineChange("")
    onLocationChange("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cuisine Filter */}
          <div>
            <Label className="text-base font-medium mb-3 block">Cuisine</Label>
            <RadioGroup value={selectedCuisine} onValueChange={onCuisineChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all-cuisines" />
                <Label htmlFor="all-cuisines">All Cuisines</Label>
              </div>
              {cuisines.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <RadioGroupItem value={cuisine} id={cuisine} />
                  <Label htmlFor={cuisine}>{cuisine}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Location Filter */}
          <div>
            <Label className="text-base font-medium mb-3 block">Location</Label>
            <RadioGroup value={selectedLocation} onValueChange={onLocationChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all-locations" />
                <Label htmlFor="all-locations">All Locations</Label>
              </div>
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <RadioGroupItem value={location} id={location} />
                  <Label htmlFor={location}>{location}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
