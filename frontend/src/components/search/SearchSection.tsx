import React, { useState } from 'react';
import { Bot, ChefHat, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { SearchBar } from './SearchBar';
import { ExactMatchToggle } from './ExactMatchToggle';
import { Button } from '../ui/Button';
import { AIChefModal } from '../ai/AIChefModal';
import { useAuth } from '../../contexts/AuthContext';
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
  const [isAiChefModalOpen, setIsAiChefModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const handleExactMatchChange = (checked: boolean) => {
    setExactMatch(checked);
    onExactMatchChange(checked);
  };

  return (
    <>
      <Card className={`backdrop-blur-sm bg-white/90 border border-teal/10 w-full max-w-4xl mx-auto overflow-visible relative transition-[z-index] duration-0 z-10`}>
        <div className="p-6">
          <div className="flex justify-between items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-teal" />
              <h2 className="text-xl font-semibold text-dark">Find Recipes</h2>
            </div>
            <div className="flex items-center gap-2">
              <ExactMatchToggle checked={exactMatch} onChange={handleExactMatchChange} />
              <Button
                variant="ghost"
                size="sm"
                className="group bg-gradient-to-r from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20"
                onClick={() => setIsAiChefModalOpen(true)}
                disabled={selectedIngredients.length < 2 || !isAuthenticated}
              >
                <ChefHat className="w-4 h-4 mr-2 text-secondary group-hover:animate-bounce" />
                <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent bg-[length:200%] bg-left hover:bg-right transition-all duration-700 font-medium">
                  Ask Jesse, AI Chef
                </span>
              </Button>
            </div>
          </div>
          <SearchBar 
            onIngredientsChange={onIngredientsChange}
            selectedIngredients={selectedIngredients}
          />
        </div>
      </Card>
      <AIChefModal
        ingredients={selectedIngredients}
        isOpen={isAiChefModalOpen}
        onClose={() => setIsAiChefModalOpen(false)}
      />
    </>
  );
}