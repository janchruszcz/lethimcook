import React, { useState } from 'react';
import { Clock, Users, UtensilsCrossed } from 'lucide-react';
import { Recipe } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RecipeModal } from './RecipeModal';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <>
      <Card className="group transform hover:-translate-y-1">
        <div className="relative h-40">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-t-xl"
          />
          {recipe.ratings && (
            <div className="absolute top-2 right-2 bg-yellow/90 text-dark font-medium px-2 py-1 rounded-full text-sm">
              ★ {recipe.ratings.toFixed(1)}
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-primary group-hover:text-primary-light transition-colors line-clamp-1">
              {recipe.title}
            </h3>
            {recipe.author && (
              <span className="text-xs text-gray-500">by {recipe.author}</span>
            )}
          </div>

          {(recipe.cuisine || recipe.category) && (
            <div className="flex gap-2 mb-3">
              {recipe.cuisine && (
                <Badge variant="secondary" className="text-xs">
                  {recipe.cuisine}
                </Badge>
              )}
              {recipe.category && (
                <Badge variant="primary" className="text-xs">
                  {recipe.category}
                </Badge>
              )}
            </div>
          )}
          
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredients.slice(0, 3).map((ingredient) => (
                <Badge key={ingredient.id} variant="secondary" className="text-xs px-2 py-0.5">
                  {ingredient.name}
                </Badge>
              ))}
              {recipe.ingredients.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{recipe.ingredients.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-primary-light" />
                <span>{totalTime}m</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={UtensilsCrossed}
              onClick={() => setShowInstructions(true)}
              className="ml-auto text-xs"
            >
              View Recipe
            </Button>
          </div>
        </CardContent>
      </Card>

      {showInstructions && (
        <RecipeModal
          recipe={recipe}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </>
  );
}