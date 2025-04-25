import { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { checkRecipeStatus } from '../api/ai';

export function usePollingRecipe(recipeId: string | null) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) {
      console.log("No recipeId provided to polling hook");
      return;
    }

    console.log("Starting polling for recipe:", recipeId);
    
    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        console.log("Polling for recipe status:", recipeId);
        const response = await checkRecipeStatus(recipeId);
        console.log("Polling response:", response);
        
        if (!isMounted) return;
        
        if (response.recipe?.status === 'completed') {
          setRecipe(response.recipe);
          setIsLoading(false);
          clearInterval(pollInterval);
          console.log("Recipe completed:", response.recipe);
        } else if (response.recipe?.status === 'failed') {
          setError('Recipe generation failed');
          setIsLoading(false);
          clearInterval(pollInterval);
          console.log("Recipe generation failed");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error polling recipe status:", err);
        setError('Failed to check recipe status');
        setIsLoading(false);
        clearInterval(pollInterval);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [recipeId]);

  return { recipe, isLoading, error };
}