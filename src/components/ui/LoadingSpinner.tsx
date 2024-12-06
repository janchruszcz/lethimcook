import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <UtensilsCrossed 
          size={48} 
          className="text-secondary animate-bounce"
        />
        <div className="absolute inset-0 animate-ping-slow opacity-75">
          <UtensilsCrossed 
            size={48} 
            className="text-secondary"
          />
        </div>
      </div>
      <p className="mt-4 text-lg text-gray-600 animate-pulse">
        Finding perfect recipes...
      </p>
    </div>
  );
}