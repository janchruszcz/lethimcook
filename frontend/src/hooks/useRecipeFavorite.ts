import { useState } from 'react';
import { toggleRecipeFavorite, isRecipeFavorited } from '../api/favorites';

export function useRecipeFavorite(recipeId?: number) {
  const [isFavorited, setIsFavorited] = useState(() => 
    recipeId ? isRecipeFavorited(recipeId) : false
  );

  const toggleFavorite = async () => {
    if (!recipeId) return;
    
    try {
      const newState = await toggleRecipeFavorite(recipeId, isFavorited);
      setIsFavorited(newState);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return { isFavorited, toggleFavorite };
}