import { api } from './client';
import { Recipe } from '../types';

export async function toggleRecipeFavorite(recipeId: number, isFavorited: boolean): Promise<boolean> {
  const { data } = isFavorited 
    ? await api.delete(`/api/v1/favorites/${recipeId}`)
    : await api.post('/api/v1/favorites', { recipe_id: recipeId });
  return data;
}

export async function isRecipeFavorited(recipeId: number): Promise<boolean> {
  const { data } = await api.get(`/api/v1/favorites/${recipeId}`);
  return data;
}

export async function getFavoriteRecipes(): Promise<Recipe[]> {
  const { data } = await api.get('/api/v1/favorites');
  return data;
}