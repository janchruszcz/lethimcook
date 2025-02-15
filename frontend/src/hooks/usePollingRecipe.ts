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
        console.log('Recipe status response:', response); // Debug log
        
        if (response.recipe?.status === 'completed' && response.recipe) {
          console.log('Setting recipe:', response.recipe); // Debug log
          setRecipe(response.recipe);
          setIsLoading(false);
        } else if (response.recipe?.status === 'failed') {
          console.log('Recipe failed:', response.error); // Debug log
          setError(response.error || 'Recipe generation failed');
          setIsLoading(false);
        } else {
          console.log('Still pending, polling...'); // Debug log
          timeoutId = setTimeout(checkStatus, pollInterval);
        }
      } catch (err) {
        console.error('Polling error:', err); // Debug log
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