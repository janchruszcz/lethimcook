import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Header } from './components/Header';
import { AuthModal } from './components/auth/AuthModal';
import { SearchSection } from './components/search/SearchSection';
import { RecipeGrid } from './components/recipe/RecipeGrid';
import { searchRecipes } from './api/recipes';
import { toggleRecipeFavorite } from './api/favorites';
import { RecipeFilters } from './types';
import { ModalProvider } from './contexts/ModalContext';

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filters, setFilters] = useState<RecipeFilters>({
    ingredients: [],
    page: 1,
  });

  const { data, isLoading } = useQuery(
    ['recipes', filters],
    () => searchRecipes(filters),
    {
      enabled: !showFavorites && filters.ingredients && filters.ingredients.length > 1,
    }
  );

  const { data: favoriteData, isLoading: isFavoritesLoading } = useQuery(
    'favoriteRecipes',
    () => searchRecipes({ favorites: true }),
    {
      enabled: showFavorites,
    }
  );

  const filteredRecipes = showFavorites ? favoriteData?.recipes || [] : data?.recipes || [];

  console.log('wtf');
  console.log(filteredRecipes);

  const handleIngredientsChange = (ingredients: string[]) => {
    setFilters(prev => ({ ...prev, ingredients, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    console.log(page);
    setFilters(prev => ({ ...prev, page }));
  };

  const handleFavoriteToggle = (recipeId: number, isFavorited: boolean) => {
    toggleRecipeFavorite(recipeId, isFavorited);
  };

  return (
    <ModalProvider>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-dark/5 via-white to-teal/5">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <Header 
                onLoginClick={() => setShowAuthModal(true)}
                showFavorites={showFavorites}
                onFavoritesClick={() => setShowFavorites(!showFavorites)}
              />

              
              {!showFavorites && (
                <SearchSection onIngredientsChange={handleIngredientsChange} />
              )}

            <div className="mt-8">
              <RecipeGrid
                recipes={filteredRecipes}
                pagination={data?.pagination || { page: 1, pages: 1 }}
                isLoading={showFavorites ? isFavoritesLoading : isLoading}
                selectedIngredientsCount={filters.ingredients?.length || 0}
                onFavoriteToggle={handleFavoriteToggle}
                onPageChange={handlePageChange}
              />
            </div>

              {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
              )}
            </div>
          </div>
        </AuthProvider>
      </ToastProvider>
    </ModalProvider>
  );
}