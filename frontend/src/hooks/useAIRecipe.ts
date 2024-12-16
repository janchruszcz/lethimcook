import { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { generateRecipe } from '../api/ai';

export function useAIRecipe(ingredients: string[], isModalOpen: boolean) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isModalOpen || !ingredients.length) return;

    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const generatedRecipe = await generateRecipe(ingredients);
        setRecipe(generatedRecipe);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to generate recipe'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [ingredients, isModalOpen]);

  return { recipe, isLoading, error };
}