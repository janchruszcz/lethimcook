import { Recipe, RecipeFilters } from '../types';
import { api } from './client';

export const searchRecipes = async (filters: RecipeFilters): Promise<Recipe[]> => {
  const { data } = await api.get<Recipe[]>('api/v1/recipes', {
    params: {
      ingredients: filters.ingredients?.join(',')
    },
  });
  return data;
};

export const getRecipe = async (id: number): Promise<Recipe> => {
  const { data } = await api.get<Recipe>(`api/v1/recipes/${id}`);
  return data;
};