import React from 'react';
import { Recipe } from '../../types';
import { RecipeCard } from './RecipeCard';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  onFavoriteToggle?: (recipeId: number, isFavorited: boolean) => void;
}

export function RecipeGrid({ recipes, isLoading, onFavoriteToggle }: RecipeGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (recipes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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