import { api } from './client';
import { Ingredient } from '../types';

export async function getIngredients(): Promise<Ingredient[]> {
  const { data } = await api.get<Ingredient[]>('/api/v1/ingredients');
  return data;
}

export async function searchIngredients(query: string): Promise<Ingredient[]> {
  const { data } = await api.get<Ingredient[]>('/api/v1/ingredients/search', {
    params: { q: query }
  });
  return data;
}