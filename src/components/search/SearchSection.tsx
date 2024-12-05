import React from 'react';
import { Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { IngredientInput } from '../IngredientInput';

interface SearchSectionProps {
  onIngredientsChange: (ingredients: string[]) => void;
}

export function SearchSection({ onIngredientsChange }: SearchSectionProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/90 border border-teal/10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Search size={20} className="text-teal" />
          <h2 className="text-xl font-semibold text-dark">Find Recipes</h2>
        </div>
        <IngredientInput onIngredientsChange={onIngredientsChange} />
      </div>
    </Card>
  );
}