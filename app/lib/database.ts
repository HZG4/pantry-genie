import { supabase } from './supabase'
import type { Recipe, DatabaseRecipe, UserProfile } from '../types/recipe'

// Convert database recipe to app recipe
function convertDatabaseRecipe(dbRecipe: DatabaseRecipe): Recipe {
  return {
    id: dbRecipe.id,
    title: dbRecipe.title,
    description: dbRecipe.description,
    ingredients: dbRecipe.ingredients,
    instructions: dbRecipe.instructions,
    prepTime: dbRecipe.prep_time,
    cookTime: dbRecipe.cook_time,
    servings: dbRecipe.servings,
    difficulty: dbRecipe.difficulty,
    cuisine: dbRecipe.cuisine,
    dietaryTags: dbRecipe.dietary_tags,
    imageUrl: dbRecipe.image_url,
    createdAt: new Date(dbRecipe.created_at),
    updatedAt: new Date(dbRecipe.updated_at),
    userId: dbRecipe.user_id
  }
}

// Convert app recipe to database recipe
function convertToDatabaseRecipe(recipe: Recipe, userId: string): Omit<DatabaseRecipe, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    prep_time: recipe.prepTime,
    cook_time: recipe.cookTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    cuisine: recipe.cuisine,
    dietary_tags: recipe.dietaryTags,
    image_url: recipe.imageUrl
  }
}

// Recipe operations
export const recipeService = {
  // Get all recipes for a user
  async getUserRecipes(userId: string): Promise<Recipe[]> {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        return []
      }

      // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user recipes:', error)
        throw new Error('Failed to fetch recipes')
      }

      return data?.map(convertDatabaseRecipe) || []
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch recipes')
    }
  },

  // Get a single recipe by ID
  async getRecipeById(recipeId: string): Promise<Recipe | null> {
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('id', recipeId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Recipe not found
        }
        console.error('Error fetching recipe:', error)
        throw new Error('Failed to fetch recipe')
      }

      return convertDatabaseRecipe(data)
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch recipe')
    }
  },

  // Check if a recipe already exists for a user
  async checkRecipeExists(recipe: Recipe, userId: string): Promise<boolean> {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        return false
      }

      // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return false
      }

      // Check for existing recipe with same title (most common case)
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('id, title, ingredients')
        .eq('user_id', userId)
        .eq('title', recipe.title)
        .limit(1)

      if (error) {
        console.error('Error checking recipe existence:', error)
        return false
      }

      // If we found a recipe with the same title, consider it a duplicate
      if (data && data.length > 0) {
        return true
      }

      // Additional check: Look for recipes with very similar ingredient lists
      // This helps catch cases where the same recipe might have slightly different titles
      const { data: similarRecipes, error: similarError } = await supabase
        .from('saved_recipes')
        .select('id, title, ingredients')
        .eq('user_id', userId)
        .limit(10)

      if (similarError) {
        console.error('Error checking similar recipes:', similarError)
        return false
      }

      // Check if any existing recipe has very similar ingredients
      if (similarRecipes) {
        for (const existingRecipe of similarRecipes) {
          if (this.areIngredientsSimilar(recipe.ingredients, existingRecipe.ingredients)) {
            return true
          }
        }
      }

      return false
    } catch (error) {
      console.error('Database error checking recipe existence:', error)
      return false
    }
  },

  // Helper method to check if two ingredient lists are similar
  areIngredientsSimilar(ingredients1: any[], ingredients2: any[]): boolean {
    if (!ingredients1 || !ingredients2) return false
    
    // Normalize ingredient names for comparison
    const normalizeIngredient = (ingredient: any) => 
      ingredient.name?.toLowerCase().trim().replace(/[^\w\s]/g, '') || ''
    
    const names1 = ingredients1.map(normalizeIngredient).sort()
    const names2 = ingredients2.map(normalizeIngredient).sort()
    
    // If ingredient lists are very similar (80% match), consider them duplicates
    const commonIngredients = names1.filter(name => names2.includes(name))
    const similarity = commonIngredients.length / Math.max(names1.length, names2.length)
    
    return similarity >= 0.8
  },

  // Save a new recipe
  async saveRecipe(recipe: Recipe, userId: string): Promise<Recipe> {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('Cannot save recipe on server side')
      }

      // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('User not authenticated')
      }

      const dbRecipe = convertToDatabaseRecipe(recipe, userId)

      const { data, error } = await supabase
        .from('saved_recipes')
        .insert(dbRecipe)
        .select()
        .single()

      if (error) {
        console.error('Error saving recipe:', error)
        throw new Error('Failed to save recipe')
      }

      return convertDatabaseRecipe(data)
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to save recipe')
    }
  },

  // Update an existing recipe
  async updateRecipe(recipeId: string, recipe: Partial<Recipe>): Promise<Recipe> {
    try {
      const updateData: any = {}
      
      if (recipe.title !== undefined) updateData.title = recipe.title
      if (recipe.description !== undefined) updateData.description = recipe.description
      if (recipe.ingredients !== undefined) updateData.ingredients = recipe.ingredients
      if (recipe.instructions !== undefined) updateData.instructions = recipe.instructions
      if (recipe.prepTime !== undefined) updateData.prep_time = recipe.prepTime
      if (recipe.cookTime !== undefined) updateData.cook_time = recipe.cookTime
      if (recipe.servings !== undefined) updateData.servings = recipe.servings
      if (recipe.difficulty !== undefined) updateData.difficulty = recipe.difficulty
      if (recipe.cuisine !== undefined) updateData.cuisine = recipe.cuisine
      if (recipe.dietaryTags !== undefined) updateData.dietary_tags = recipe.dietaryTags

      const { data, error } = await supabase
        .from('saved_recipes')
        .update(updateData)
        .eq('id', recipeId)
        .select()
        .single()

      if (error) {
        console.error('Error updating recipe:', error)
        throw new Error('Failed to update recipe')
      }

      return convertDatabaseRecipe(data)
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to update recipe')
    }
  },

  // Delete a recipe
  async deleteRecipe(recipeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId)

      if (error) {
        console.error('Error deleting recipe:', error)
        throw new Error('Failed to delete recipe')
      }
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to delete recipe')
    }
  },

  // Search recipes by title, description, or ingredients
  async searchRecipes(userId: string, query: string): Promise<Recipe[]> {
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching recipes:', error)
        throw new Error('Failed to search recipes')
      }

      return data?.map(convertDatabaseRecipe) || []
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to search recipes')
    }
  }
}

// User profile operations
export const profileService = {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Profile not found
        }
        console.error('Error fetching user profile:', error)
        throw new Error('Failed to fetch user profile')
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch user profile')
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        throw new Error('Failed to update user profile')
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to update user profile')
    }
  },

  // Create user profile (if not exists)
  async createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({ id: userId, ...profile })
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        throw new Error('Failed to create user profile')
      }

      return data
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to create user profile')
    }
  }
}
