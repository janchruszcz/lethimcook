import { Recipe, RecipeFilters } from '../types';
import { api } from './client';

export const searchRecipes = async (filters: RecipeFilters): Promise<Recipe[]> => {
  const { data } = await api.get<Recipe[]>('/recipes', {
    params: {
      ingredients: filters.ingredients?.join(','),
      cuisine: filters.cuisine,
      category: filters.category,
    },
  });
  return data;
};

export const getRecipe = async (id: number): Promise<Recipe> => {
  const { data } = await api.get<Recipe>(`/recipes/${id}`);
  return data;
};