import { create } from 'zustand';
import type { Recipe, RecipeFilters } from '../types';

interface RecipeState {
  // State
  filters: RecipeFilters;
  recipes: Recipe[];
  isLoading: boolean;
  pagination: any;

  // Actions
  setFilters: (filters: RecipeFilters) => void;
  toggleFavorites: () => void;
  toggleMyRecipes: () => void;
  updateIngredients: (ingredients: string[]) => void;
  updatePage: (page: number) => void;
  updateExactMatch: (exactMatch: boolean) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setLoading: (loading: boolean) => void;
  setPagination: (pagination: any) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  // Initial state
  filters: {
    ingredients: [],
    page: 1,
    exactMatch: false,
    showFavorites: false,
    showMyRecipes: false,
  },
  recipes: [],
  isLoading: false,
  pagination: null,

  // Actions
  setFilters: (filters) => set({ filters }),
  toggleFavorites: () => 
    set((state) => ({ 
      filters: { ...state.filters, showFavorites: !state.filters.showFavorites, showMyRecipes: false }
    })),
  toggleMyRecipes: () => 
    set((state) => ({ 
      filters: { ...state.filters, showMyRecipes: !state.filters.showMyRecipes, showFavorites: false }
    })),
  updateIngredients: (ingredients) =>
    set((state) => ({
      filters: { ...state.filters, ingredients, page: 1 }
    })),
  updatePage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page }
    })),
  updateExactMatch: (exactMatch) =>
    set((state) => ({
      filters: { ...state.filters, exactMatch }
    })),
  setRecipes: (recipes) => set({ recipes }),
  setLoading: (isLoading) => set({ isLoading }),
  setPagination: (pagination) => set({ pagination }),
}));
