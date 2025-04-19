import { Recipe } from '../types';
import { api } from './client';

interface GenerateRecipeResponse {
  recipeId: string;
  status: 'pending' | 'completed' | 'failed';
  recipe?: Recipe;
}

export async function generateRecipe(ingredients: string[]): Promise<string> {
  const { data } = await api.post<{ recipeId: string }>('/api/v1/ai_chef/generate_recipe', {
    ingredients
  });
  return data.recipeId;
}

export async function checkRecipeStatus(recipeId: string): Promise<GenerateRecipeResponse> {
  const { data } = await api.get<GenerateRecipeResponse>(`/api/v1/ai_chef/recipe_status/${recipeId}`);
  return data;
}