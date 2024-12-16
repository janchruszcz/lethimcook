import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface AIChefErrorProps {
  message?: string;
}

export function AIChefError({ message = "Jesse couldn't create a recipe right now. Please try again later." }: AIChefErrorProps) {
  return (
    <div className="text-center py-12">
      <UtensilsCrossed size={48} className="mx-auto text-red-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}