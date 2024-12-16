import React from 'react';
import { ChefHat } from 'lucide-react';

export function AIChefLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <ChefHat size={48} className="text-secondary animate-bounce" />
        <div className="absolute inset-0 animate-ping-slow opacity-75">
          <ChefHat size={48} className="text-secondary" />
        </div>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-800">
        Jesse is cooking something special...
      </h3>
      <p className="mt-2 text-gray-600">
        Crafting a unique recipe with your ingredients
      </p>
    </div>
  );
}