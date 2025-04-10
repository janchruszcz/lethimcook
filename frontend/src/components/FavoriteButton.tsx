import React from 'react';
import { Heart } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from './ui/Button';

interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: () => Promise<void>;
  className?: string;
}

export function FavoriteButton({ isFavorited, onToggle, className }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={className}
    >
      <Heart
        className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
      />
    </Button>
  );
}