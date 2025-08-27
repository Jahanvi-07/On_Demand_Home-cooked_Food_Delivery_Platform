"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
  createdAt: string
}

interface MealsContextType {
  meals: Meal[]
  addMeal: (meal: Omit<Meal, "id" | "rating" | "createdAt">) => void
  updateMeal: (id: string, updates: Partial<Meal>) => void
  deleteMeal: (id: string) => void
  getMealsByChef: (chefId: string) => Meal[]
}

const MealsContext = createContext<MealsContextType | undefined>(undefined)

export function MealsProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([])

  // Load meals from localStorage on mount
  useEffect(() => {
    const storedMeals = localStorage.getItem("allMeals")
    if (storedMeals) {
      setMeals(JSON.parse(storedMeals))
    }
  }, [])

  // Save meals to localStorage whenever meals change
  useEffect(() => {
    localStorage.setItem("allMeals", JSON.stringify(meals))
  }, [meals])

  const addMeal = (mealData: Omit<Meal, "id" | "rating" | "createdAt">) => {
    const newMeal: Meal = {
      ...mealData,
      id: Date.now().toString(),
      rating: 4.5, // Default rating for new meals
      createdAt: new Date().toISOString().split("T")[0],
    }

    setMeals((prev) => [newMeal, ...prev])
  }

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    setMeals((prev) => prev.map((meal) => (meal.id === id ? { ...meal, ...updates } : meal)))
  }

  const deleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id))
  }

  const getMealsByChef = (chefId: string) => {
    return meals.filter((meal) => meal.chefId === chefId)
  }

  return (
    <MealsContext.Provider
      value={{
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        getMealsByChef,
      }}
    >
      {children}
    </MealsContext.Provider>
  )
}

export function useMeals() {
  const context = useContext(MealsContext)
  if (context === undefined) {
    throw new Error("useMeals must be used within a MealsProvider")
  }
  return context
}
