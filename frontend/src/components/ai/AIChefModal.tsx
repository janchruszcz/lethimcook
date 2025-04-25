import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { AIChefLoading } from './AIChefLoading';
import { AIChefError } from './AIChefError';
import { AIGeneratedRecipe } from './AIGeneratedRecipe';
import { useRecipeFavorite } from '../../hooks/useRecipeFavorite';
import { generateRecipe } from '../../api/ai';
import { usePollingRecipe } from '../../hooks/usePollingRecipe';
import { useQueryClient } from 'react-query';

interface AIChefModalProps {
  ingredients: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function AIChefModal({ ingredients, isOpen, onClose }: AIChefModalProps) {
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const { recipe, isLoading, error } = usePollingRecipe(recipeId);
  const { isFavorited, toggleFavorite } = useRecipeFavorite(recipe?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("AIChefModal effect - isOpen:", isOpen, "ingredients:", ingredients);
    
    if (isOpen && ingredients.length > 0) {
      const startGeneration = async () => {
        try {
          console.log("Starting recipe generation with ingredients:", ingredients);
          const newRecipeId = await generateRecipe(ingredients);
          console.log("Got recipe ID:", newRecipeId);
          setRecipeId(newRecipeId);
        } catch (err) {
          console.error('Failed to start recipe generation:', err);
        }
      };
      startGeneration();
    }
  }, [isOpen, ingredients]);

  useEffect(() => {
    if (recipe && recipe.status === 'completed') {
      console.log('Recipe completed, invalidating queries');
      queryClient.invalidateQueries(['recipes']);
      queryClient.invalidateQueries(['recipe', recipe.id]);
    }
  }, [recipe, queryClient]);

  useEffect(() => {
    console.log('Recipe status:', { 
      recipeId, 
      recipe, 
      isLoading, 
      error, 
      recipeStatus: recipe?.status 
    });
  }, [recipeId, recipe, isLoading, error]);

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