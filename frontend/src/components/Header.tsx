import React from 'react';
import { ChefHat, UserCircle, LogOut, Heart, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface HeaderProps {
  onLoginClick: () => void;
  showFavorites: boolean;
  onFavoritesClick: () => void;
}

export function Header({ onLoginClick, showFavorites, onFavoritesClick }: HeaderProps) {
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
        <Card className="backdrop-blur-sm bg-white/90 border border-teal/10 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFavoritesClick}
            className="flex items-center gap-2 text-coral/70 hover:text-coral"
            disabled={!isAuthenticated}
          >
            {showFavorites ? (
              <Search className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {showFavorites ? 'Search' : 'Favorites'}
            </span>
          </Button>
        </Card>
      </div>

      {/* Auth Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="backdrop-blur-sm bg-white/90 border border-teal/10 shadow-sm">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
                className="text-secondary hover:text-secondary-dark"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoginClick}
              className="text-secondary hover:text-secondary-dark"
            >
              <UserCircle className="w-5 h-5 mr-2" />
              Login
            </Button>
          )}
        </Card>
      </div>

      {/* Main Header Content */}
      <div className="text-center space-y-4">
        <button 
          onClick={() => showFavorites && onFavoritesClick()}
          className="inline-block"
        >
          <Card className="inline-flex items-center justify-center gap-3 backdrop-blur-sm bg-white/90 border border-teal/10 px-6 py-3 shadow-sm">
            <ChefHat size={32} className="text-teal" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal via-yellow to-coral bg-clip-text text-transparent">
              lethimcook.food
            </h1>
          </Card>
        </button>
        
        <p className="text-lg text-dark/80 animate-fade-in">
          {showFavorites ? 'Your Favorite Recipes' : 'Discover recipes with ingredients you already have'}
        </p>
      </div>
    </div>
  );
}