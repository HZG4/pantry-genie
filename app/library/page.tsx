'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Recipe } from '../types/recipe'

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

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes)

  // TODO: Replace with actual Supabase data fetching
  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     const { data, error } = await supabase
  //       .from('saved_recipes')
  //       .select('*')
  //       .eq('user_id', user.id)
  //     if (data) setRecipes(data)
  //   }
  //   fetchRecipes()
  // }, [user])

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.ingredients.some(ingredient => 
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const handleRecipeClick = (recipe: Recipe) => {
    // Navigate to recipe detail page
    window.location.href = `/recipe/${recipe.id}`
  }

  const handleDeleteRecipe = (recipeId: string) => {
    // TODO: Implement delete functionality with Supabase
    setRecipes(recipes.filter(recipe => recipe.id !== recipeId))
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
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
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/generate">Generate Recipes</Link>
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
            {/* Page Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#1b120d] tracking-light text-[32px] font-bold leading-tight min-w-72">My Saved Recipes</p>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div
                    className="text-[#9a664c] flex border-none bg-[#f3ebe7] items-center justify-center pl-4 rounded-l-xl border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search recipes"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border-none bg-[#f3ebe7] focus:border-none h-full placeholder:text-[#9a664c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  />
                </div>
              </label>
            </div>

            {/* Recipes Section */}
            <h3 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">All Recipes</h3>
            
            {filteredRecipes.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-4 text-[#1b120d]">No recipes found</h3>
                <p className="text-[#9a664c] mb-6">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Start by generating some recipes!'}
                </p>
                {!searchQuery && (
                  <Link
                    href="/generate"
                    className="bg-[#ee6c2b] hover:bg-[#d55a1f] text-white px-6 py-3 rounded-lg transition-colors inline-block"
                  >
                    Generate Your First Recipe
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                {filteredRecipes.map((recipe) => (
                  <div 
                    key={recipe.id} 
                    className="flex flex-col gap-3 pb-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                      style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-${recipe.id === '1' ? '1563379926898-05f4575a45d8' : 
                          recipe.id === '2' ? '1621996346565-e3dbc353d2e5' :
                          recipe.id === '3' ? '1546069902-ba9599a7e63c' :
                          recipe.id === '4' ? '1544025162-0be1a038a1b8' :
                          recipe.id === '5' ? '1499636136210-6026e6c0e231' :
                          '1504674900204-0697e668a1c7'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")`
                      }}
                    ></div>
                    <div>
                      <p className="text-[#1b120d] text-base font-medium leading-normal">{recipe.title}</p>
                      <p className="text-[#9a664c] text-sm font-normal leading-normal">{recipe.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
