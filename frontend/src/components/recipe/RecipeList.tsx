import React from 'react';
import { Recipe } from '../../types';
import { RecipeCard } from './RecipeCard';
import { UtensilsCrossed } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
}

export function RecipeList({ recipes, isLoading }: RecipeListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-56 rounded-t-xl" />
            <div className="p-6 bg-white rounded-b-xl">
              <div className="h-7 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
              <div className="flex flex-wrap gap-2 mb-6">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-6 w-20 bg-gray-200 rounded-full" />
                ))}
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-xl">
          No recipes found. Try adding more ingredients!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}