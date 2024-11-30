import { Recipe } from '../types';

export function filterRecipesByIngredients(recipes: Recipe[], ingredients: string[]): Recipe[] {
  if (ingredients.length === 0) return [];
  
  const lowercaseIngredients = ingredients.map(i => i.toLowerCase());
  
  return recipes.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
    return lowercaseIngredients.some(ingredient => 
      recipeIngredients.includes(ingredient)
    );
  });
}