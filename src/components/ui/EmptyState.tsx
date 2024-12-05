import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 text-xl">
        No recipes found. Try adding more ingredients!
      </p>
    </div>
  );
}