import React from 'react';
import {
  Carrot,
  Coffee,
  Egg,
  Fish,
  Beef,
  Wheat,
  Apple,
  Milk,
  Cookie,
  Sandwich,
  Soup,
  Cherry,
  Wine,
  IceCream2 as IceCream,
  Banana,
  Salad,
  Pizza as CheeseIcon
} from 'lucide-react';
import clsx from 'clsx';

const INGREDIENT_CATEGORIES = [
  {
    icon: Salad,
    name: 'Vegetables',
    items: ['lettuce', 'spinach', 'kale', 'arugula', 'cabbage']
  },
  {
    icon: Carrot,
    name: 'Produce',
    items: ['tomatoes', 'carrot', 'potato', 'onion', 'garlic', 'cucumber', 'bell pepper']
  },
  {
    icon: Beef,
    name: 'Meat',
    items: ['chicken', 'beef', 'pork', 'bacon', 'turkey']
  },
  {
    icon: Fish,
    name: 'Seafood',
    items: ['salmon', 'tuna', 'shrimp', 'cod', 'tilapia']
  },
  {
    icon: Milk,
    name: 'Dairy',
    items: ['milk', 'cream', 'yogurt', 'butter']
  },
  {
    icon: CheeseIcon,
    name: 'Cheese',
    items: ['cheddar', 'mozzarella', 'parmesan', 'feta']
  }
];

interface IngredientSuggestionsProps {
  onSelect: (ingredient: string) => void;
  selectedIngredients: string[];
}

export function IngredientSuggestions({ onSelect, selectedIngredients }: IngredientSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {INGREDIENT_CATEGORIES.map(({ icon: Icon, name, items }, categoryIndex) => (
        <div 
          key={categoryIndex} 
          className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Icon size={18} className="text-secondary" />
            <h3 className="text-sm font-medium text-gray-700">{name}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient);
              return (
                <button
                  key={ingredient}
                  onClick={() => !isSelected && onSelect(ingredient)}
                  disabled={isSelected}
                  className={clsx(
                    'px-3 py-1.5 text-sm rounded-full transition-all duration-200',
                    isSelected
                      ? 'bg-primary/20 text-primary-dark cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-secondary/10 hover:text-secondary hover:shadow-sm border border-gray-100'
                  )}
                >
                  {ingredient}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}