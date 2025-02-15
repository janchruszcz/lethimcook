import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { AIChefLoading } from './AIChefLoading';
import { AIChefError } from './AIChefError';
import { AIGeneratedRecipe } from './AIGeneratedRecipe';
import { useRecipeFavorite } from '../../hooks/useRecipeFavorite';
import { generateRecipe } from '../../api/ai';
import { usePollingRecipe } from '../../hooks/usePollingRecipe';

interface AIChefModalProps {
  ingredients: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function AIChefModal({ ingredients, isOpen, onClose }: AIChefModalProps) {
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const { recipe, isLoading, error } = usePollingRecipe(recipeId);
  const { isFavorited, toggleFavorite } = useRecipeFavorite(recipe?.id);

  useEffect(() => {
    if (isOpen && ingredients.length > 0) {
      const startGeneration = async () => {
        try {
          const newRecipeId = await generateRecipe(ingredients);
          setRecipeId(newRecipeId);
        } catch (err) {
          console.error('Failed to start recipe generation:', err);
        }
      };
      startGeneration();
    }
  }, [isOpen, ingredients]);

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} size="lg">
      <div className="p-8">
        {isLoading ? (
          <AIChefLoading />
        ) : error ? (
          <AIChefError message={error} />
        ) : recipe ? (
          <AIGeneratedRecipe
            recipe={recipe}
            onFavoriteToggle={toggleFavorite}
            isFavorited={isFavorited}
          />
        ) : null}
      </div>
    </Modal>
  );
}