import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface EmptyStateProps {
  selectedIngredientsCount: number;
}

export function EmptyState({ selectedIngredientsCount }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 text-xl">
        {selectedIngredientsCount === 0 ? (
          "Start by adding some ingredients above"
        ) : selectedIngredientsCount === 1 ? (
          "Add more ingredients to find matching recipes"
        ) : (
          "No recipes found with these ingredients. Try different combinations!"
        )}
      </p>
      {selectedIngredientsCount > 0 && selectedIngredientsCount < 2 && (
        <p className="text-gray-400 mt-2">
          Add at least 2 ingredients to see recipe suggestions
        </p>
      )}
    </div>
  );
}