import React from 'react';
import {
  Beef,
  Carrot,
  Apple,
  Wheat,
  Milk,
  Leaf,
  Nut,
  Cookie,
  Sandwich,
  Droplet,
} from 'lucide-react';
import clsx from 'clsx';

const INGREDIENT_CATEGORIES = [
  {
    icon: Beef,
    name: 'Proteins',
    items: ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'bacon', 'ham', 'duck', 'quail',
           'shrimp', 'salmon', 'tuna', 'cod', 'tilapia', 'halibut', 'sea bass', 'trout',
           'mussels', 'clams', 'oysters', 'scallops', 'crab', 'lobster', 'octopus', 'squid',
           'tofu', 'tempeh', 'eggs']
  },
  {
    icon: Carrot,
    name: 'Vegetables',
    items: ['garlic', 'onion', 'tomato', 'carrot', 'celery', 'potato', 'spinach', 'kale',
           'broccoli', 'cauliflower', 'mushroom', 'zucchini', 'bell pepper', 'cucumber',
           'lettuce', 'asparagus', 'brussels sprouts', 'cabbage', 'corn', 'sweet potato',
           'peas', 'green beans', 'artichoke', 'radish', 'turnip', 'beet', 'squash', 'pumpkin']
  },
  {
    icon: Apple,
    name: 'Fruits',
    items: ['avocado', 'apple', 'banana', 'strawberry', 'blueberry', 'raspberry', 'blackberry', 'orange',
           'grapefruit', 'pineapple', 'mango', 'papaya', 'coconut', 'lemon', 'lime',
           'dates', 'raisins', 'cranberry', 'fig', 'prune']
  },
  {
    icon: Wheat,
    name: 'Grains and Pasta',
    items: ['pasta', 'rice', 'quinoa', 'couscous', 'barley', 'oats', 'millet', 'buckwheat',
           'amaranth', 'sorghum', 'wild rice', 'jasmine rice', 'basmati rice']
  },
  {
    icon: Milk,
    name: 'Dairy and Alternatives',
    items: ['butter', 'cream', 'milk', 'yogurt', 'sour cream', 'cream cheese',
           'feta', 'mozzarella', 'parmesan', 'cheddar', 'gouda', 'blue cheese', 'ricotta']
  },
  {
    icon: Leaf,
    name: 'Herbs and Spices',
    items: ['salt', 'pepper', 'basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro',
           'bay leaf', 'sage', 'mint', 'dill', 'chives', 'paprika', 'cayenne', 'chili powder',
           'cinnamon', 'nutmeg', 'clove', 'ginger', 'turmeric', 'curry', 'cumin', 'coriander']
  },
  {
    icon: Nut,
    name: 'Nuts and Seeds',
    items: ['almond', 'walnut', 'pecan', 'cashew', 'peanut', 'hazelnut', 'pistachio',
           'chia seeds', 'flax seeds', 'pumpkin seeds', 'sunflower seeds', 'sesame seeds',
           'pine nuts', 'macadamia', 'brazil nuts']
  },
  {
    icon: Cookie,
    name: 'Baking and Sweeteners',
    items: ['flour', 'sugar', 'brown sugar', 'honey', 'maple syrup', 'molasses', 'corn syrup',
           'baking powder', 'baking soda', 'yeast', 'cornstarch', 'chocolate', 'cocoa powder']
  },
  {
    icon: Sandwich,
    name: 'Processed and Prepared',
    items: ['bread crumbs', 'tortilla', 'naan', 'pita', 'baguette', 'pancetta', 'prosciutto',
           'salami', 'pepperoni', 'chorizo', 'sausage', 'hot dog', 'anchovy', 'sardine']
  },
  {
    icon: Droplet,
    name: 'Liquids and Fats',
    items: ['chicken broth', 'beef broth', 'vegetable broth', 'ghee', 'margarine', 'shortening', 
            'lard', 'wine', 'red wine', 'white wine', 'rice wine', 'sake']
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