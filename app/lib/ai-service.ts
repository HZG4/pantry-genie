import type { Recipe, RecipeGenerationRequest, RecipeGenerationResponse } from '../types/recipe'

// Mock AI service - in a real app, this would call an actual AI API
export class AIService {
  static async generateRecipe(request: RecipeGenerationRequest): Promise<RecipeGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const { ingredients, dietaryConstraints = [], cuisinePreference, servings = 4, maxCookTime = 60 } = request

    // Generate a recipe based on the ingredients
    const recipe = this.createMockRecipe(ingredients, dietaryConstraints, cuisinePreference, servings, maxCookTime)

    return {
      recipe,
      confidence: 0.85,
      alternatives: []
    }
  }

  private static createMockRecipe(
    ingredients: string[],
    dietaryConstraints: string[],
    cuisinePreference?: string,
    servings: number = 4,
    maxCookTime: number = 60
  ): Recipe {
    const mainIngredient = ingredients[0]?.toLowerCase() || 'chicken'
    const cuisine = cuisinePreference || this.getCuisineFromIngredients(ingredients)
    
    const recipeTemplates = {
      chicken: {
        title: 'Herb-Roasted Chicken with Vegetables',
        description: 'A delicious and healthy one-pan meal featuring tender chicken and fresh vegetables.',
        ingredients: [
          { name: 'chicken breast', amount: 4, unit: 'pieces' },
          { name: 'olive oil', amount: 2, unit: 'tbsp' },
          { name: 'garlic', amount: 4, unit: 'cloves' },
          { name: 'rosemary', amount: 2, unit: 'sprigs' },
          { name: 'thyme', amount: 2, unit: 'sprigs' },
          { name: 'lemon', amount: 1, unit: 'piece' },
          { name: 'bell peppers', amount: 2, unit: 'pieces' },
          { name: 'zucchini', amount: 2, unit: 'pieces' },
          { name: 'salt', amount: 1, unit: 'tsp' },
          { name: 'black pepper', amount: 1, unit: 'tsp' }
        ],
        instructions: [
          'Preheat oven to 400°F (200°C).',
          'Season chicken breasts with salt and pepper on both sides.',
          'Heat olive oil in a large oven-safe skillet over medium-high heat.',
          'Add chicken breasts and sear for 3-4 minutes per side until golden brown.',
          'Add minced garlic, rosemary, and thyme to the skillet.',
          'Arrange bell peppers and zucchini around the chicken.',
          'Squeeze lemon juice over everything and add lemon wedges.',
          'Transfer skillet to preheated oven and bake for 20-25 minutes.',
          'Let rest for 5 minutes before serving.'
        ],
        prepTime: 15,
        cookTime: 25,
        difficulty: 'easy' as const
      },
      pasta: {
        title: 'Creamy Garlic Pasta Primavera',
        description: 'A rich and creamy pasta dish loaded with fresh vegetables and aromatic garlic.',
        ingredients: [
          { name: 'pasta', amount: 1, unit: 'lb' },
          { name: 'heavy cream', amount: 1, unit: 'cup' },
          { name: 'garlic', amount: 6, unit: 'cloves' },
          { name: 'parmesan cheese', amount: 1, unit: 'cup' },
          { name: 'broccoli', amount: 2, unit: 'cups' },
          { name: 'cherry tomatoes', amount: 1, unit: 'cup' },
          { name: 'basil', amount: 1/4, unit: 'cup' },
          { name: 'butter', amount: 2, unit: 'tbsp' },
          { name: 'salt', amount: 1, unit: 'tsp' },
          { name: 'black pepper', amount: 1/2, unit: 'tsp' }
        ],
        instructions: [
          'Bring a large pot of salted water to boil and cook pasta according to package directions.',
          'In a large skillet, melt butter over medium heat.',
          'Add minced garlic and sauté until fragrant, about 1 minute.',
          'Add heavy cream and bring to a gentle simmer.',
          'Stir in parmesan cheese until melted and smooth.',
          'Add broccoli and cook for 2-3 minutes until tender-crisp.',
          'Drain pasta and add to the skillet with cherry tomatoes.',
          'Toss everything together and season with salt and pepper.',
          'Garnish with fresh basil before serving.'
        ],
        prepTime: 10,
        cookTime: 20,
        difficulty: 'medium' as const
      },
      rice: {
        title: 'Spicy Vegetable Fried Rice',
        description: 'A quick and flavorful fried rice packed with vegetables and aromatic spices.',
        ingredients: [
          { name: 'cooked rice', amount: 4, unit: 'cups' },
          { name: 'eggs', amount: 3, unit: 'pieces' },
          { name: 'soy sauce', amount: 3, unit: 'tbsp' },
          { name: 'sesame oil', amount: 2, unit: 'tbsp' },
          { name: 'garlic', amount: 4, unit: 'cloves' },
          { name: 'ginger', amount: 1, unit: 'tbsp' },
          { name: 'carrots', amount: 2, unit: 'pieces' },
          { name: 'peas', amount: 1, unit: 'cup' },
          { name: 'green onions', amount: 4, unit: 'pieces' },
          { name: 'red chili', amount: 1, unit: 'piece' }
        ],
        instructions: [
          'Heat sesame oil in a large wok or skillet over high heat.',
          'Scramble eggs and set aside.',
          'Add minced garlic, ginger, and chili to the wok.',
          'Stir-fry for 30 seconds until fragrant.',
          'Add diced carrots and cook for 2 minutes.',
          'Add peas and cook for 1 minute.',
          'Add cooked rice and break up any clumps.',
          'Pour in soy sauce and stir-fry for 2-3 minutes.',
          'Add scrambled eggs and green onions.',
          'Toss everything together and serve hot.'
        ],
        prepTime: 15,
        cookTime: 10,
        difficulty: 'easy' as const
      }
    }

    // Select recipe template based on main ingredient
    let template = recipeTemplates.chicken
    if (ingredients.some(i => i.toLowerCase().includes('pasta'))) {
      template = recipeTemplates.pasta
    } else if (ingredients.some(i => i.toLowerCase().includes('rice'))) {
      template = recipeTemplates.rice
    }

    // Adjust servings
    const scaleFactor = servings / 4
    const scaledIngredients = template.ingredients.map(ingredient => ({
      ...ingredient,
      amount: Math.round(ingredient.amount * scaleFactor * 10) / 10
    }))

    // Adjust cooking time based on maxCookTime
    let adjustedCookTime = template.cookTime
    if (adjustedCookTime > maxCookTime) {
      adjustedCookTime = Math.max(15, maxCookTime - 10)
    }

    return {
      id: `recipe-${Date.now()}`,
      title: template.title,
      description: template.description,
      ingredients: scaledIngredients,
      instructions: template.instructions,
      prepTime: template.prepTime,
      cookTime: adjustedCookTime,
      servings,
      difficulty: template.difficulty,
      cuisine,
      dietaryTags: dietaryConstraints,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private static getCuisineFromIngredients(ingredients: string[]): string {
    const ingredientStr = ingredients.join(' ').toLowerCase()
    
    if (ingredientStr.includes('soy') || ingredientStr.includes('ginger') || ingredientStr.includes('sesame')) {
      return 'asian'
    }
    if (ingredientStr.includes('pasta') || ingredientStr.includes('basil') || ingredientStr.includes('parmesan')) {
      return 'italian'
    }
    if (ingredientStr.includes('chili') || ingredientStr.includes('cumin') || ingredientStr.includes('tortilla')) {
      return 'mexican'
    }
    
    return 'american'
  }
}
