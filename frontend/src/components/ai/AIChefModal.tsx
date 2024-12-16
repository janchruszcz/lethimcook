import React from 'react';
import { Modal } from '../ui/Modal';
import { useAIRecipe } from '../../hooks/useAIRecipe';
import { AIChefLoading } from './AIChefLoading';
import { AIChefError } from './AIChefError';
import { AIGeneratedRecipe } from './AIGeneratedRecipe';
import { useRecipeFavorite } from '../../hooks/useRecipeFavorite';
interface AIChefModalProps {
  ingredients: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function AIChefModal({ ingredients, isOpen, onClose }: AIChefModalProps) {
  const { recipe, isLoading, error } = useAIRecipe(ingredients, isOpen);
  const { isFavorited, toggleFavorite } = useRecipeFavorite(recipe?.id);

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} size="lg">
      <div className="p-8">
        {isLoading ? (
          <AIChefLoading />
        ) : error ? (
          <AIChefError />
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