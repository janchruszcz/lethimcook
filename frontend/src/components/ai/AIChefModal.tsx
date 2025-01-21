import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useAIRecipe } from '../../hooks/useAIRecipe';
import { AIChefLoading } from './AIChefLoading';
import { AIChefError } from './AIChefError';
import { AIGeneratedRecipe } from './AIGeneratedRecipe';
import { useRecipeFavorite } from '../../hooks/useRecipeFavorite';
import { generateRecipe } from '../../api/ai';
import { usePollingJob } from '../../hooks/usePollingJob';

interface AIChefModalProps {
  ingredients: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function AIChefModal({ ingredients, isOpen, onClose }: AIChefModalProps) {
  const [jobId, setJobId] = useState<string | null>(null);
  const { recipe, isLoading, error } = usePollingJob(jobId);
  const { isFavorited, toggleFavorite } = useRecipeFavorite(recipe?.id);

  useEffect(() => {
    if (isOpen && ingredients.length > 0) {
      const startJob = async () => {
        try {
          const newJobId = await generateRecipe(ingredients);
          setJobId(newJobId);
        } catch (err) {
          console.error('Failed to start recipe generation:', err);
        }
      };
      startJob();
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