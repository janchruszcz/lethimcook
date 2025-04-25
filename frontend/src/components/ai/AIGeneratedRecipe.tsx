import React from 'react';
import { Clock, UtensilsCrossed } from 'lucide-react';
import { Recipe } from '../../types';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../FavoriteButton';

interface AIGeneratedRecipeProps {
  recipe: Recipe;
  onFavoriteToggle: () => Promise<void>;
  isFavorited: boolean;
}

export function AIGeneratedRecipe({ recipe, onFavoriteToggle, isFavorited }: AIGeneratedRecipeProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-64">
        <img
          alt={recipe.title}
          src={recipe.main_image}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{recipe.title}</h2>
        <p className="text-gray-600 mb-4">{recipe.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.cuisine && (
            <Badge variant="secondary">{recipe.cuisine}</Badge>
          )}
          {recipe.category && (
            <Badge variant="primary">{recipe.category}</Badge>
          )}
          {recipe.cookingTime && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={16} />
              <span>{recipe.cookingTime} min</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
          <div className="grid grid-cols-2 gap-2">
            {recipe.ingredient_entries?.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center gap-2 text-gray-700"
              >
                <span className="w-2 h-2 bg-secondary rounded-full" />
                {ingredient}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Instructions</h3>
          <ol className="space-y-4">
            {recipe.instructions?.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}