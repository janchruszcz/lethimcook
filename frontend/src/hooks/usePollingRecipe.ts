import { useState, useEffect } from 'react';
import { checkRecipeStatus } from '../api/ai';
import { Recipe } from '../types';

export function usePollingRecipe(recipeId: string | null) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!recipeId) return;

    const pollInterval = 3000;
    let timeoutId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const response = await checkRecipeStatus(recipeId);
        
        if (response.recipe?.status === 'completed' && response.recipe) {
          setRecipe(response.recipe);
          setIsLoading(false);
        } else if (response.recipe?.status === 'failed') {
          setError(response.error || 'Recipe generation failed');
          setIsLoading(false);
        } else {
          timeoutId = setTimeout(checkStatus, pollInterval);
        }
      } catch (err) {
        setError('Failed to check recipe status');
        setIsLoading(false);
      }
    };

    checkStatus();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [recipeId]);

  return { recipe, error, isLoading };
}