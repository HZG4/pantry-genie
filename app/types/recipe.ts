export interface Recipe {
  id: string
  title: string
  description?: string
  ingredients: RecipeIngredient[]
  instructions: string[]
  prepTime: number // in minutes
  cookTime: number // in minutes
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  cuisine?: string
  dietaryTags: string[]
  createdAt: Date
  updatedAt: Date
  userId?: string // for saved recipes
}

export interface RecipeIngredient {
  name: string
  amount: number
  unit: string
  notes?: string
}

export interface RecipeGenerationRequest {
  ingredients: string[]
  dietaryConstraints?: string[]
  cuisinePreference?: string
  servings?: number
  maxCookTime?: number // in minutes
}

export interface RecipeGenerationResponse {
  recipe: Recipe
  confidence: number
  alternatives?: Recipe[]
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
}

export interface SavedRecipe {
  id: string
  userId: string
  recipe: Recipe
  savedAt: Date
  notes?: string
  rating?: number
}
