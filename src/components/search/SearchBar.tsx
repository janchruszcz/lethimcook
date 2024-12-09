import React, { useState, useRef, useCallback } from 'react';
import { Search as SearchIcon, Plus, X } from 'lucide-react';
import { useQuery } from 'react-query';
import { searchIngredients } from '../../api/ingredients';
import { Ingredient } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface SearchBarProps {
  onIngredientsChange: (ingredients: string[]) => void;
}

export function SearchBar({ onIngredientsChange }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  const { data: suggestions = [], isLoading } = useQuery(
    ['ingredientSearch', debouncedSearch],
    () => searchIngredients(debouncedSearch),
    {
      enabled: debouncedSearch.length > 1,
      keepPreviousData: true,
    }
  );

  const handleSelect = useCallback((ingredient: Ingredient | string) => {
    const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.name;
    if (!selectedIngredients.includes(ingredientName)) {
      const newIngredients = [...selectedIngredients, ingredientName];
      setSelectedIngredients(newIngredients);
      onIngredientsChange(newIngredients);
    }
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, [selectedIngredients, onIngredientsChange]);

  const removeIngredient = (index: number) => {
    const newIngredients = selectedIngredients.filter((_, i) => i !== index);
    setSelectedIngredients(newIngredients);
    onIngredientsChange(newIngredients);
  };

  return (
    <div className="space-y-6">
      <div ref={containerRef} className="relative">
        <div className="relative">
          <SearchIcon 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
          />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                handleSelect(searchTerm.trim());
              }
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Add an ingredient"
            className="w-full pl-10 pr-16 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={() => searchTerm.trim() && handleSelect(searchTerm.trim())}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-secondary text-white rounded-md hover:bg-secondary-light transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && searchTerm.length > 1 && (
          <div className="absolute left-0 right-0 mt-1">
            <div className="relative">
              <div className="absolute left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-100 max-h-[300px] overflow-y-auto z-[9999]">
                {isLoading ? (
                  <div className="p-4 text-gray-500">Loading...</div>
                ) : suggestions.length > 0 ? (
                  <ul className="py-2">
                    {suggestions.map((ingredient) => (
                      <li key={ingredient.id}>
                        <button
                          onClick={() => handleSelect(ingredient)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                        >
                          <span className="font-medium text-gray-700">{ingredient.name}</span>
                          <span className="ml-2 text-sm text-gray-500">{ingredient.category}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-gray-500">No ingredients found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedIngredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIngredients.map((ingredient, index) => (
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
    </div>
  );
}