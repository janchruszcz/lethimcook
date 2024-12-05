import React from 'react';
import { X, Clock } from 'lucide-react';
import { Recipe } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../FavoriteButton';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onFavoriteToggle: () => Promise<void>;
  isFavorited: boolean;
}

export function RecipeModal({ recipe, onClose, onFavoriteToggle, isFavorited }: RecipeModalProps) {
  console.log(recipe);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-t-xl"
          />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <FavoriteButton
              isFavorited={isFavorited}
              onToggle={onFavoriteToggle}
              className="bg-white/90 hover:bg-white"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="bg-white/90 hover:bg-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary mb-2">{recipe.title}</h2>
            {recipe.description && (
              <p className="text-gray-600 mb-4">{recipe.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {recipe.cuisine && (
                <Badge variant="secondary">{recipe.cuisine}</Badge>
              )}
              {recipe.category && (
                <Badge variant="primary">{recipe.category}</Badge>
              )}
              {(recipe.prepTime || recipe.cookTime) && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            {recipe.ingredients?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-secondary rounded-full" />
                    {ingredient.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No ingredients listed</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            {recipe.instructions.length > 0 ? (
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500 italic">No instructions listed</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}