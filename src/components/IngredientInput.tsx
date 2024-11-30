import React, { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { IngredientSuggestions } from './IngredientSuggestions';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: string[]) => void;
}

export function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');

  const addIngredient = (ingredient: string = currentIngredient.trim()) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      const newIngredients = [...ingredients, ingredient];
      setIngredients(newIngredients);
      onIngredientsChange(newIngredients);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    onIngredientsChange(newIngredients);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
        />
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
          placeholder="Type an ingredient and press Enter..."
          className="w-full pl-10 pr-16 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
        />
        <button
          onClick={() => addIngredient()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-secondary text-white rounded-md hover:bg-secondary-light transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary-dark rounded-full hover:bg-secondary/20 transition-colors"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(index)}
                className="p-0.5 hover:bg-secondary/30 rounded-full transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      <IngredientSuggestions
        onSelect={addIngredient}
        selectedIngredients={ingredients}
      />
    </div>
  );
}