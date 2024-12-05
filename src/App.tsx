import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Header } from './components/Header';
import { AuthModal } from './components/auth/AuthModal';
import { SearchSection } from './components/search/SearchSection';
import { RecipeGrid } from './components/recipe/RecipeGrid';
import { searchRecipes } from './api/recipes';
import { RecipeFilters } from './types';

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState<RecipeFilters>({
    ingredients: [],
  });

  const { data: recipes = [], isLoading } = useQuery(
    ['recipes', filters],
    () => searchRecipes(filters),
    {
      enabled: filters.ingredients && filters.ingredients.length > 0,
    }
  );

  const handleIngredientsChange = (ingredients: string[]) => {
    setFilters(prev => ({ ...prev, ingredients }));
  };

  const handleFavoriteToggle = (recipeId: number, isFavorited: boolean) => {
    console.log('Recipe favorite toggled:', recipeId, isFavorited);
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-dark/5 via-white to-teal/5">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Header onLoginClick={() => setShowAuthModal(true)} />

            <div className="flex flex-col gap-8">
              <SearchSection onIngredientsChange={handleIngredientsChange} />
              <RecipeGrid
                recipes={recipes}
                isLoading={isLoading}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>

            {showAuthModal && (
              <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
          </div>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}