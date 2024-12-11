import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { SearchBar } from './SearchBar';
import { ExactMatchToggle } from './ExactMatchToggle';

interface SearchSectionProps {
  onIngredientsChange: (ingredients: string[]) => void;
  onExactMatchChange: (exactMatch: boolean) => void;
  selectedIngredients: string[];
}

export function SearchSection({ 
  onIngredientsChange, 
  onExactMatchChange,
  selectedIngredients 
}: SearchSectionProps) {
  const [exactMatch, setExactMatch] = useState(false);

  const handleExactMatchChange = (checked: boolean) => {
    setExactMatch(checked);
    onExactMatchChange(checked);
  };

  return (
    <Card className={`backdrop-blur-sm bg-white/90 border border-teal/10 w-full max-w-4xl mx-auto overflow-visible relative transition-[z-index] duration-0 z-10`}>
      <div className="p-6">
        <div className="flex justify-between items-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-teal" />
            <h2 className="text-xl font-semibold text-dark">Find Recipes</h2>
          </div>
          <div className="flex items-center gap-2">
            <ExactMatchToggle checked={exactMatch} onChange={handleExactMatchChange} />
          </div>
        </div>
        <SearchBar 
          onIngredientsChange={onIngredientsChange}
          selectedIngredients={selectedIngredients}
        />
      </div>
    </Card>
  );
}