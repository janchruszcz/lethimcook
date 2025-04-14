import { create } from 'zustand';
import type { Recipe, RecipeFilters, PaginationMetadata } from '../types';
import { deleteRecipe, createRecipe, updateRecipe } from '../api/recipes';

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
  setPagination: (pagination: PaginationMetadata) => void;
  deleteRecipe: (recipeId: number) => Promise<void>;
  createRecipe: (formData: FormData) => Promise<Recipe>;
  updateRecipe: (recipeId: number, formData: FormData) => Promise<Recipe>;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
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

  deleteRecipe: async (recipeId: number) => {
    try {
      await deleteRecipe(recipeId);
      const currentState = get();
      const newRecipes = currentState.recipes.filter(recipe => recipe.id !== recipeId);
      
      // If we're on the last page and it becomes empty, go to previous page
      if (newRecipes.length === 0 && currentState.pagination.page > 1) {
        set(state => ({
          filters: { ...state.filters, page: state.filters.page - 1 }
        }));
      } else {
        set({ recipes: newRecipes });
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      throw error;
    }
  },

  createRecipe: async (formData: FormData) => {
    set({ isLoading: true });
    try {
      const newRecipe = await createRecipe(formData);
      
      // Only update the store if we're on the first page
      const currentState = get();
      if (currentState.filters.page === 1) {
        set(state => ({ 
          recipes: [newRecipe, ...state.recipes],
          pagination: {
            ...state.pagination,
            total: (state.pagination?.total || 0) + 1
          }
        }));
      }
      
      return newRecipe;
    } catch (error) {
      console.error('Failed to create recipe:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRecipe: async (recipeId: number, formData: FormData) => {
    set({ isLoading: true });
    try {
      const updatedRecipe = await updateRecipe(recipeId, formData);
      
      // Update the recipe in the current list if it exists
      const currentState = get();
      const recipeIndex = currentState.recipes.findIndex(r => r.id === recipeId);
      
      if (recipeIndex !== -1) {
        set(state => ({
          recipes: state.recipes.map(recipe => 
            recipe.id === recipeId ? updatedRecipe : recipe
          )
        }));
      }
      
      return updatedRecipe;
    } catch (error) {
      console.error('Failed to update recipe:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
