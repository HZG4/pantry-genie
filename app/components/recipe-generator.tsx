'use client'

import { useState, useEffect } from 'react'
import type { RecipeGenerationRequest } from '../types/recipe'

interface RecipeGeneratorProps {
  onGenerate: (request: RecipeGenerationRequest) => void
  isLoading?: boolean
  prefilledIngredients?: string[]
}

export function RecipeGenerator({ onGenerate, isLoading = false, prefilledIngredients = [] }: RecipeGeneratorProps) {
  const [ingredients, setIngredients] = useState<string[]>([''])
  const [dietaryConstraints, setDietaryConstraints] = useState<string[]>([])
  const [cuisinePreference, setCuisinePreference] = useState('')
  const [servings, setServings] = useState(4)
  const [maxCookTime, setMaxCookTime] = useState(60)

  useEffect(() => {
    if (prefilledIngredients.length > 0) {
      setIngredients(prefilledIngredients)
    }
  }, [prefilledIngredients])

  const addIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== '')
    if (filteredIngredients.length === 0) return

    onGenerate({
      ingredients: filteredIngredients,
      dietaryConstraints: dietaryConstraints.length > 0 ? dietaryConstraints : undefined,
      cuisinePreference: cuisinePreference || undefined,
      servings,
      maxCookTime
    })
  }

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 
    'low-carb', 'keto', 'paleo', 'halal', 'kosher'
  ]

  const cuisineOptions = [
    'italian', 'mexican', 'chinese', 'indian', 'japanese',
    'thai', 'mediterranean', 'french', 'american', 'greek'
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#1b120d]">Generate Your Recipe</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ingredients Section */}
        <div>
          <label className="block text-sm font-medium text-[#1b120d] mb-3">
            Available Ingredients *
          </label>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder="e.g., chicken breast, rice, tomatoes..."
                  className="flex-1 px-3 py-2 border border-[#e7d7cf] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ee6c2b] bg-[#fcf9f8] text-[#1b120d] placeholder:text-[#9a664c]"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="text-[#ee6c2b] hover:text-[#1b120d] text-sm"
            >
              + Add another ingredient
            </button>
          </div>
        </div>

        {/* Dietary Constraints */}
        <div>
          <label className="block text-sm font-medium text-[#1b120d] mb-3">
            Dietary Preferences
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {dietaryOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={dietaryConstraints.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setDietaryConstraints([...dietaryConstraints, option])
                    } else {
                      setDietaryConstraints(dietaryConstraints.filter(c => c !== option))
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize text-[#1b120d]">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cuisine Preference */}
        <div>
          <label className="block text-sm font-medium text-[#1b120d] mb-2">
            Cuisine Preference
          </label>
          <select
            value={cuisinePreference}
            onChange={(e) => setCuisinePreference(e.target.value)}
            className="w-full px-3 py-2 border border-[#e7d7cf] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ee6c2b] bg-[#fcf9f8] text-[#1b120d]"
          >
            <option value="">Any cuisine</option>
            {cuisineOptions.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Servings and Cook Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1b120d] mb-2">
              Servings
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 4)}
              className="w-full px-3 py-2 border border-[#e7d7cf] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ee6c2b] bg-[#fcf9f8] text-[#1b120d]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1b120d] mb-2">
              Max Cook Time (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="180"
              step="15"
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(parseInt(e.target.value) || 60)}
              className="w-full px-3 py-2 border border-[#e7d7cf] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ee6c2b] bg-[#fcf9f8] text-[#1b120d]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || ingredients.filter(i => i.trim()).length === 0}
          className="w-full bg-[#ee6c2b] hover:bg-[#d55a1f] disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? 'Generating Recipe...' : '🧞‍♂️ Generate Recipe'}
        </button>
      </form>
    </div>
  )
}
