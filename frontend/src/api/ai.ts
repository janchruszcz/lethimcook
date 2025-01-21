import { Recipe } from '../types';
import { api } from './client';

interface GenerateRecipeResponse {
  jobId: string;
  status: 'pending' | 'completed' | 'failed';
  recipe?: Recipe;
}

export async function generateRecipe(ingredients: string[]): Promise<string> {
  const { data } = await api.post<{ jobId: string }>('/api/v1/ai/generate_recipe', {
    ingredients
  });
  return data.jobId;
}

export async function checkRecipeStatus(jobId: string): Promise<GenerateRecipeResponse> {
  const { data } = await api.get<GenerateRecipeResponse>(`/api/v1/ai/recipe_status/${jobId}`);
  return data;
}