import React from 'react';
import { Recipe, PaginationMetadata } from '../../types';
import { RecipeCard } from './RecipeCard';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Pagination } from '../ui/Pagination';

export interface RecipeGridProps {
  recipes: Recipe[];
  pagination?: PaginationMetadata;
  isLoading: boolean;
  selectedIngredientsCount: number;
  onFavoriteToggle?: (recipeId: number, isFavorited: boolean) => void;
  onPageChange: (page: number) => void;
  onDeleteRecipe: (recipeId: number) => Promise<void>;
}

export function RecipeGrid({ 
  recipes, 
  pagination,
  isLoading, 
  selectedIngredientsCount,
  onPageChange,
  onDeleteRecipe
}: RecipeGridProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (recipes.length === 0) {
    return <EmptyState selectedIngredientsCount={selectedIngredientsCount} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDeleteRecipe={onDeleteRecipe}
          />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}