import { Recipe } from '../types';
import { api } from './client';

export async function generateRecipe(ingredients: string[]): Promise<Recipe> {
  const { data } = await api.post<Recipe>('/api/v1/ai/generate_recipe', {
    ingredients
  });
  return data;
}