import React from 'react';
import { ChefHat } from 'lucide-react';

export function AuthIllustration() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-secondary/5 to-primary/5 p-8 rounded-l-xl">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 mb-6">
          <ChefHat size={40} className="text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Discover Amazing Recipes
        </h3>
        <p className="text-gray-600 max-w-sm">
          Join our community to save your favorite recipes and get personalized recommendations based on your taste.
        </p>
      </div>
    </div>
  );
}