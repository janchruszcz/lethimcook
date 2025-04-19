import { api } from './client';

export async function toggleRecipeFavorite(recipeId: number, isFavorited: boolean): Promise<boolean> {
  const { data } = isFavorited 
    ? await api.delete(`/api/v1/favorites/${recipeId}`)
    : await api.post('/api/v1/favorites', { id: recipeId });
  return data;
}

export async function isRecipeFavorited(recipeId: number): Promise<boolean> {
  const { data } = await api.get(`/api/v1/favorites/${recipeId}`);
  return data;
}