'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import type { Recipe } from '../../types/recipe'

// Mock data for demonstration - will be replaced with Supabase data
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spicy Chicken Stir-Fry',
    description: 'Quick and flavorful stir-fry with a spicy kick.',
    ingredients: [
      { name: 'chicken breast', amount: 1, unit: 'lb' },
      { name: 'soy sauce', amount: 2, unit: 'tbsp' },
      { name: 'garlic', amount: 3, unit: 'cloves' },
      { name: 'ginger', amount: 1, unit: 'tbsp' },
      { name: 'vegetables', amount: 2, unit: 'cups' }
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Heat oil in a wok or large skillet',
      'Add chicken and cook until golden',
      'Add vegetables and stir-fry',
      'Season with soy sauce and serve'
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    cuisine: 'asian',
    dietaryTags: ['high-protein'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Creamy Tomato Pasta',
    description: 'Rich and creamy pasta with a hint of sweetness.',
    ingredients: [
      { name: 'pasta', amount: 1, unit: 'lb' },
      { name: 'tomatoes', amount: 4, unit: 'medium' },
      { name: 'heavy cream', amount: 1, unit: 'cup' },
      { name: 'garlic', amount: 4, unit: 'cloves' },
      { name: 'basil', amount: 1/4, unit: 'cup' }
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Sauté garlic in olive oil',
      'Add tomatoes and cook until softened',
      'Stir in cream and simmer',
      'Toss with pasta and basil'
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'italian',
    dietaryTags: ['vegetarian'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Lemon Herb Roasted Salmon',
    description: 'Flaky salmon with a zesty lemon and herb crust.',
    ingredients: [
      { name: 'salmon fillets', amount: 4, unit: 'pieces' },
      { name: 'lemon', amount: 2, unit: 'pieces' },
      { name: 'fresh herbs', amount: 1/4, unit: 'cup' },
      { name: 'olive oil', amount: 2, unit: 'tbsp' },
      { name: 'garlic', amount: 3, unit: 'cloves' }
    ],
    instructions: [
      'Preheat oven to 400°F',
      'Season salmon with herbs and lemon',
      'Place on baking sheet',
      'Roast for 12-15 minutes',
      'Serve with lemon wedges'
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'mediterranean',
    dietaryTags: ['high-protein', 'omega-3'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Vegetarian Chili',
    description: 'Hearty and comforting chili packed with vegetables.',
    ingredients: [
      { name: 'kidney beans', amount: 2, unit: 'cans' },
      { name: 'bell peppers', amount: 2, unit: 'pieces' },
      { name: 'onion', amount: 1, unit: 'large' },
      { name: 'tomatoes', amount: 28, unit: 'oz can' },
      { name: 'chili powder', amount: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Sauté onions and peppers',
      'Add beans and tomatoes',
      'Season with chili powder',
      'Simmer for 30 minutes',
      'Serve with toppings'
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: 'easy',
    cuisine: 'mexican',
    dietaryTags: ['vegetarian', 'vegan'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    title: 'Chocolate Chip Cookies',
    description: 'Classic cookies with gooey chocolate chips.',
    ingredients: [
      { name: 'flour', amount: 2.5, unit: 'cups' },
      { name: 'butter', amount: 1, unit: 'cup' },
      { name: 'chocolate chips', amount: 2, unit: 'cups' },
      { name: 'eggs', amount: 2, unit: 'pieces' },
      { name: 'vanilla', amount: 1, unit: 'tsp' }
    ],
    instructions: [
      'Cream butter and sugar',
      'Add eggs and vanilla',
      'Mix in flour and chocolate chips',
      'Drop onto baking sheet',
      'Bake at 375°F for 10-12 minutes'
    ],
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: 'easy',
    cuisine: 'american',
    dietaryTags: ['dessert'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    title: 'Apple Crumble',
    description: 'Warm and comforting dessert with a crispy topping.',
    ingredients: [
      { name: 'apples', amount: 6, unit: 'medium' },
      { name: 'flour', amount: 1, unit: 'cup' },
      { name: 'oats', amount: 1, unit: 'cup' },
      { name: 'brown sugar', amount: 1, unit: 'cup' },
      { name: 'cinnamon', amount: 1, unit: 'tsp' }
    ],
    instructions: [
      'Slice apples and place in baking dish',
      'Mix flour, oats, sugar, and cinnamon',
      'Sprinkle topping over apples',
      'Bake at 375°F for 30 minutes',
      'Serve warm with ice cream'
    ],
    prepTime: 20,
    cookTime: 30,
    servings: 8,
    difficulty: 'easy',
    cuisine: 'american',
    dietaryTags: ['dessert', 'vegetarian'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // TODO: Replace with actual Supabase data fetching
        // const { data, error } = await supabase
        //   .from('saved_recipes')
        //   .select('*')
        //   .eq('id', params.id)
        //   .single()
        
        // For now, use mock data
        const foundRecipe = mockRecipes.find(r => r.id === params.id)
        
        if (foundRecipe) {
          setRecipe(foundRecipe)
        } else {
          setError('Recipe not found')
        }
      } catch (err) {
        setError('Failed to load recipe')
        console.error('Recipe fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchRecipe()
    }
  }, [params.id])

  const handleEditRecipe = () => {
    // TODO: Navigate to edit page or open edit modal
    alert('Edit functionality coming soon!')
  }

  const handleDeleteRecipe = () => {
    // TODO: Implement delete functionality with Supabase
    if (confirm('Are you sure you want to delete this recipe?')) {
      alert('Delete functionality will be implemented with backend integration!')
      // After successful deletion, navigate back to library
      // router.push('/library')
    }
  }

  const handleShareRecipe = () => {
    // TODO: Implement share functionality
    if (navigator.share && recipe) {
      navigator.share({
        title: recipe.title,
        text: recipe.description || `Check out this recipe: ${recipe.title}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Recipe link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div
        className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
        style={{
          '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(154,102,76)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')'
        } as React.CSSProperties}
      >
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ebe7] px-10 py-3">
            <div className="flex items-center gap-4 text-[#1b120d]">
              <h2 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em]">Pantry Genie</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/">Home</Link>
                <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/library">My Recipes</Link>
              </div>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAV9TKwSwIjOKctAV3h1fx8E-ZDwPRfjMUGEO4a1CQIcJX5NUupRnFE3ANUqopg-E-vYdnjxmwFS2sPVd8uT73u2SYrZ9lz5aM1CakUrW9YVaQLbUc5GpND5IAEbc_SKP3D3WBCheB9NTHkdHZg_-0lBKxkz8n-P-QCxlpOVCWLIIEE23wLdGKZnTOsyZmv1zXYEdbIN-1nkOnnJahS4v4Yb93jLblAzSwTR3pwGVa9uCJNYV1F-IvC0fB5EAE7Kg70EhoywJ7qN00k")'
                }}
              ></div>
            </div>
          </header>

          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ee6c2b] mx-auto mb-6"></div>
                <h3 className="text-2xl font-semibold mb-4 text-[#1b120d]">Loading recipe...</h3>
                <p className="text-[#9a664c] text-lg">Please wait while we fetch your recipe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div
        className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
        style={{
          '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(154,102,76)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')'
        } as React.CSSProperties}
      >
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ebe7] px-10 py-3">
            <div className="flex items-center gap-4 text-[#1b120d]">
              <h2 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em]">Pantry Genie</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/">Home</Link>
                <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/library">My Recipes</Link>
              </div>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAV9TKwSwIjOKctAV3h1fx8E-ZDwPRfjMUGEO4a1CQIcJX5NUupRnFE3ANUqopg-E-vYdnjxmwFS2sPVd8uT73u2SYrZ9lz5aM1CakUrW9YVaQLbUc5GpND5IAEbc_SKP3D3WBCheB9NTHkdHZg_-0lBKxkz8n-P-QCxlpOVCWLIIEE23wLdGKZnTOsyZmv1zXYEdbIN-1nkOnnJahS4v4Yb93jLblAzSwTR3pwGVa9uCJNYV1F-IvC0fB5EAE7Kg70EhoywJ7qN00k")'
                }}
              ></div>
            </div>
          </header>

          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold mb-4 text-[#1b120d]">Recipe not found</h3>
                <p className="text-[#9a664c] mb-6">{error || 'The recipe you\'re looking for doesn\'t exist.'}</p>
                <Link
                  href="/library"
                  className="bg-[#ee6c2b] hover:bg-[#d55a1f] text-white px-6 py-3 rounded-lg transition-colors inline-block"
                >
                  Back to My Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
      style={{
        '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(154,102,76)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')'
      } as React.CSSProperties}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ebe7] px-10 py-3">
          <div className="flex items-center gap-4 text-[#1b120d]">
            <h2 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em]">Pantry Genie</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/">Home</Link>
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/library">My Recipes</Link>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAV9TKwSwIjOKctAV3h1fx8E-ZDwPRfjMUGEO4a1CQIcJX5NUupRnFE3ANUqopg-E-vYdnjxmwFS2sPVd8uT73u2SYrZ9lz5aM1CakUrW9YVaQLbUc5GpND5IAEbc_SKP3D3WBCheB9NTHkdHZg_-0lBKxkz8n-P-QCxlpOVCWLIIEE23wLdGKZnTOsyZmv1zXYEdbIN-1nkOnnJahS4v4Yb93jLblAzSwTR3pwGVa9uCJNYV1F-IvC0fB5EAE7Kg70EhoywJ7qN00k")'
              }}
            ></div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Recipe Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#1b120d] tracking-light text-[32px] font-bold leading-tight min-w-72">{recipe.title}</p>
            </div>
            
            {/* Recipe Image */}
            <div className="flex w-full grow bg-[#fcf9f8] @container p-4">
              <div className="w-full gap-1 overflow-hidden bg-[#fcf9f8] @[480px]:gap-2 aspect-[3/2] rounded-xl flex">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                  style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-${recipe.id === '1' ? '1563379926898-05f4575a45d8' : 
                      recipe.id === '2' ? '1621996346565-e3dbc353d2e5' :
                      recipe.id === '3' ? '1546069902-ba9599a7e63c' :
                      recipe.id === '4' ? '1544025162-0be1a038a1b8' :
                      recipe.id === '5' ? '1499636136210-6026e6c0e231' :
                      '1504674900204-0697e668a1c7'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")`
                  }}
                ></div>
              </div>
            </div>

            {/* Recipe Meta Info */}
            {recipe.description && (
              <div className="px-4 py-2">
                <p className="text-[#9a664c] text-base font-normal leading-normal">{recipe.description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-[#1b120d] text-sm font-medium">⏱️ Prep: {recipe.prepTime}m</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#1b120d] text-sm font-medium">🔥 Cook: {recipe.cookTime}m</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#1b120d] text-sm font-medium">👥 Serves: {recipe.servings}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#1b120d] text-sm font-medium capitalize">📊 Difficulty: {recipe.difficulty}</span>
              </div>
              {recipe.cuisine && (
                <div className="flex items-center gap-2">
                  <span className="text-[#1b120d] text-sm font-medium capitalize">🌍 Cuisine: {recipe.cuisine}</span>
                </div>
              )}
            </div>

            {/* Dietary Tags */}
            {recipe.dietaryTags.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 py-2">
                {recipe.dietaryTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#f3ebe7] text-[#1b120d] text-xs rounded-full capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Ingredients */}
            <h3 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Ingredients</h3>
            <ul className="text-[#1b120d] text-base font-normal leading-normal pb-3 pt-1 px-4 space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>• {ingredient.amount} {ingredient.unit} {ingredient.name}</li>
              ))}
            </ul>

            {/* Instructions */}
            <h3 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Instructions</h3>
            <ol className="text-[#1b120d] text-base font-normal leading-normal pb-3 pt-1 px-4 space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{index + 1}. {instruction}</li>
              ))}
            </ol>

            {/* Action Buttons */}
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <button
                  onClick={handleEditRecipe}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#ee6c2b] text-[#fcf9f8] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Edit Recipe</span>
                </button>
                <button
                  onClick={handleShareRecipe}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f3ebe7] text-[#1b120d] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Share</span>
                </button>
                <button
                  onClick={handleDeleteRecipe}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-red-100 text-red-700 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-200"
                >
                  <span className="truncate">Delete</span>
                </button>
                <Link
                  href="/library"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f3ebe7] text-[#1b120d] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Back to My Recipes</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
