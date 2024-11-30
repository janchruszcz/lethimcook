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
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFilters {
  ingredients?: string[];
  cuisine?: string;
  category?: string;
}