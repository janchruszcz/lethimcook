export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface Ingredient {
  id: number;
  name: string;
}

export interface Recipe {
  id: number;
  title: string;
  instructions: string[];
  imageUrl: string;
  prepTime?: number;
  cookTime?: number;
  ratings?: number;
  cuisine?: string;
  category?: string;
  author?: string;
  ingredients: Ingredient[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFilters {
  ingredients?: string[];
  page?: number;
  cuisine?: string;
  category?: string;
  exactMatch?: boolean;
}

export interface PaginationMetadata {
  page: number;
  pages: number;
  count: number;
  items: number;
}