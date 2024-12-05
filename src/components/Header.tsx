import React from 'react';
import { ChefHat, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
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
      {/* Auth Button - Top Right */}
      <div className="absolute top-4 right-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-teal/10">
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
            className="bg-white/90 backdrop-blur-sm hover:bg-white/95 text-secondary hover:text-secondary-dark shadow-sm border border-teal/10"
          >
            <UserCircle className="w-5 h-5 mr-2" />
            Login
          </Button>
        )}
      </div>

      {/* Main Header Content */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-teal/10">
          <ChefHat size={32} className="text-teal" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal via-yellow to-coral bg-clip-text text-transparent">
            lethimcook.food
          </h1>
        </div>
        
        <p className="text-lg text-dark/80 animate-fade-in">
          Discover recipes with ingredients you already have
        </p>
      </div>
    </div>
  );
}