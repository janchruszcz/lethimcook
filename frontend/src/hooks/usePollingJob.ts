import { useState, useEffect } from 'react';
import { checkRecipeStatus } from '../api/ai';
import { Recipe } from '../types';

export function usePollingJob(jobId: string | null) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;

    const pollInterval = 2000; // Poll every 2 seconds
    let timeoutId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const response = await checkRecipeStatus(jobId);
        
        if (response.status === 'completed' && response.recipe) {
          setRecipe(response.recipe);
          setIsLoading(false);
        } else if (response.status === 'failed') {
          setError('Recipe generation failed');
          setIsLoading(false);
        } else {
          // Schedule next poll
          timeoutId = setTimeout(checkStatus, pollInterval);
        }
      } catch (err) {
        setError('Failed to check recipe status');
        setIsLoading(false);
      }
    };

    checkStatus();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [jobId]);

  return { recipe, error, isLoading };
}