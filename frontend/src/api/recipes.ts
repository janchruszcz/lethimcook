import { Recipe, RecipeFilters } from '../types';
import { api } from './client';

export const getRecipes = async (filters: RecipeFilters): Promise<Recipe[]> => {
  const { data } = await api.get<Recipe[]>('api/v1/recipes', {
    params: {
      ingredients: filters.ingredients,
      page: filters.page,
      exact: filters.exactMatch,
      favorites: filters.showFavorites,
      my_recipes: filters.showMyRecipes
    },
  });
  return data;
};

export const getRecipe = async (id: number): Promise<Recipe> => {
  const { data } = await api.get<Recipe>(`api/v1/recipes/${id}`);
  return data;
};

export const createRecipe = async (formData: FormData): Promise<Recipe> => {
  const { data } = await api.post<Recipe>('api/v1/recipes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateRecipe = async (id: number, formData: FormData): Promise<Recipe> => {
  const { data } = await api.put<Recipe>(`api/v1/recipes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteRecipe = async (id: number): Promise<void> => {
  await api.delete(`api/v1/recipes/${id}`);
};
