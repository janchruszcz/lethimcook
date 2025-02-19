import React from 'react';
import { ChefHat, UserCircle, LogOut, Heart, Search, Plus, Utensils } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface HeaderProps {
  onLoginClick: () => void;
  onProfileClick: () => void;
  showFavorites: boolean;
  showMyRecipes: boolean;
  onFavoritesClick: () => void;
  onMyRecipesClick: () => void;
  onCreateRecipeClick: () => void;
}

export function Header({ onLoginClick, onProfileClick, showFavorites, showMyRecipes, onFavoritesClick, onMyRecipesClick, onCreateRecipeClick }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Successfully logged out!', 'success');
    } catch (error) {
      showToast('Failed to log out. Please try again.', 'error');
    }
  };

  return (
    <div className="relative mb-8">
      {/* Favorites Button - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="">
          <div className="flex gap-1">
            <Button
              variant={showFavorites ? "primary" : "ghost"}
              size="sm"
              onClick={onFavoritesClick}
              className={`group bg-gradient-to-r ${
                showFavorites 
                  ? 'from-secondary to-primary text-white'
                  : 'from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20'
              }`}
              title={showFavorites ? 'Back to Search' : 'Favorites'}
            >
              <Heart 
                className={`w-4 h-4 ${
                  showFavorites 
                    ? 'text-white' 
                    : 'text-secondary group-hover:animate-bounce'
                }`}
              />
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  variant={showMyRecipes ? "primary" : "ghost"}
                  size="sm"
                  onClick={onMyRecipesClick}
                  className={`group bg-gradient-to-r ${
                    showMyRecipes 
                      ? 'from-secondary to-primary text-white'
                      : 'from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20'
                  }`}
                  title={showMyRecipes ? 'Back to Search' : 'My Recipes'}
                >
                  <Utensils 
                    className={`w-4 h-4 ${
                      showMyRecipes 
                        ? 'text-white' 
                        : 'text-secondary group-hover:animate-bounce'
                    }`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateRecipeClick}
                  className="group bg-gradient-to-r from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20"
                  title="Create Recipe"
                >
                  <Plus className="w-4 h-4 text-secondary group-hover:animate-bounce" />
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Auth Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="">
          <div className="flex gap-1">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfileClick}
                className="group bg-gradient-to-r from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20"
                title="Profile"
              >
                <UserCircle className="w-4 h-4 text-secondary group-hover:animate-bounce" />
              </Button>
            )}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="group bg-gradient-to-r from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-secondary group-hover:animate-bounce" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className="group bg-gradient-to-r from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20"
                title="Login"
              >
                <UserCircle className="w-4 h-4 text-secondary group-hover:animate-bounce" />
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Main Header Content */}
      <div className="text-center space-y-4">
        <button 
          onClick={() => showFavorites && onFavoritesClick()}
          className="inline-block"
        >
          <Card className="inline-flex items-center justify-center gap-3 backdrop-blur-sm bg-white/90 border border-teal/10 px-6 py-3 shadow-sm hover:shadow-xl">
            <ChefHat size={32} className="text-teal" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal via-yellow to-coral bg-clip-text text-transparent">
              lethimcook.food
            </h1>
          </Card>
        </button>
        
        <p className="text-lg text-dark/80 animate-fade-in">
          {showFavorites 
            ? 'Your Favorite Recipes' 
            : showMyRecipes 
              ? 'Your Created Recipes'
              : 'Discover recipes with ingredients you already have'}
        </p>
      </div>
    </div>
  );
}