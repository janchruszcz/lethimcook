import React, { useState } from 'react';
import { Bot, ChefHat, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { SearchBar } from './SearchBar';
import { ExactMatchToggle } from './ExactMatchToggle';
import { Button } from '../ui/Button';
import { AIChefModal } from '../ai/AIChefModal';
import { useRecipeStore } from '../../stores/useRecipeStore';
import { useModalStore } from '../../stores/useModalStore';
import { useAuthStore } from '../../stores/useAuthStore';

export function SearchSection() {
  const { filters, updateIngredients, updateExactMatch } = useRecipeStore();
  const { showAiChefModal, openAiChefModal, closeAiChefModal } = useModalStore();
  const { isAuthenticated } = useAuthStore();
  
  return (
    <>
      <Card className={`backdrop-blur-sm hover:shadow-xl bg-white/90 border border-teal/10 w-full max-w-4xl mx-auto overflow-visible relative transition-[z-index] duration-0 z-10`}>
        <div className="p-6">
          <div className="flex justify-between items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-teal" />
              <h2 className="text-xl font-semibold text-dark">Find Recipes</h2>
            </div>
            <div className="flex items-center gap-2">
              <ExactMatchToggle checked={filters.exactMatch} onChange={updateExactMatch} />
              <Button
                variant="ghost"
                size="sm"
                className="group bg-gradient-to-r from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20"
                onClick={openAiChefModal}
                disabled={filters.ingredients.length < 2 || !isAuthenticated}
              >
                <ChefHat className="w-4 h-4 mr-2 text-secondary group-hover:animate-bounce" />
                <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent bg-[length:200%] bg-left hover:bg-right transition-all duration-700 font-medium">
                  Ask Mario
                </span>
              </Button>
            </div>
          </div>
          <SearchBar 
            onIngredientsChange={updateIngredients}
            selectedIngredients={filters.ingredients || []}
          />
        </div>
      </Card>

      <AIChefModal
        ingredients={filters.ingredients || []}
        isOpen={showAiChefModal}
        onClose={closeAiChefModal}
      />
    </>
  );
}