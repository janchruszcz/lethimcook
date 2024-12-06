import React from 'react';
import { Recipe } from '../../types';
import { RecipeCard } from './RecipeCard';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  selectedIngredientsCount: number;
  onFavoriteToggle?: (recipeId: number, isFavorited: boolean) => void;
}

export function RecipeGrid({ 
  recipes, 
  isLoading, 
  selectedIngredientsCount,
  onFavoriteToggle 
}: RecipeGridProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (recipes.length === 0) {
    return <EmptyState selectedIngredientsCount={selectedIngredientsCount} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-0">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}