import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ChefHat, Sparkles, Search } from 'lucide-react';
import { IngredientInput } from './components/IngredientInput';
import { RecipeList } from './components/recipe/RecipeList';
import { searchRecipes } from './api/recipes';
import { Card } from './components/ui/Card';
import { RecipeFilters } from './types';

export default function App() {
  const [filters, setFilters] = useState<RecipeFilters>({
    ingredients: [],
  });

  const { data: recipes = [], isLoading } = useQuery(
    ['recipes', filters],
    () => searchRecipes(filters),
    {
      enabled: filters.ingredients && filters.ingredients.length > 0,
    }
  );

  const handleIngredientsChange = (ingredients: string[]) => {
    setFilters(prev => ({ ...prev, ingredients }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark/5 via-white to-teal/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-teal/10">
            <ChefHat size={32} className="text-teal" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal via-yellow to-coral bg-clip-text text-transparent">
              lethimcook.it
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg text-dark/80 animate-fade-in">
            <Sparkles size={16} className="text-yellow" />
            <p>Discover recipes with ingredients you already have</p>
            <Sparkles size={16} className="text-yellow" />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Search Section */}
          <Card className="backdrop-blur-sm bg-white/90 border border-teal/10">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Search size={20} className="text-teal" />
                <h2 className="text-xl font-semibold text-dark">Find Recipes</h2>
              </div>
              <IngredientInput onIngredientsChange={handleIngredientsChange} />
            </div>
          </Card>

          {/* Recipes Section */}
          <RecipeList recipes={recipes} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}