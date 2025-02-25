import React, { useState, useRef } from 'react';
import { Plus, Minus, Search as SearchIcon, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { createRecipe } from '../../api/recipes';
import { useQuery } from 'react-query';
import { searchIngredients } from '../../api/ingredients';
import { useDebounce } from '../../hooks/useDebounce';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRecipeModal({ isOpen, onClose }: CreateRecipeModalProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(searchContainerRef, () => setIsSearchOpen(false));

  const { data: suggestions = [], isLoading } = useQuery(
    ['ingredientSearch', debouncedSearch],
    () => searchIngredients(debouncedSearch),
    {
      enabled: debouncedSearch.length > 1,
      keepPreviousData: true,
    }
  );

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleIngredientSelect = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
    setSearchTerm('');
    setIsSearchOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const recipeData = {
        title,
        description,
        imageUrl,
        cookTime: parseInt(cookTime, 10),
        ingredients: ingredients.filter(i => i.trim() !== ''),
        instructions: instructions.filter(i => i.trim() !== ''),
      };

      await createRecipe(recipeData);
      showToast('Recipe created successfully!', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to create recipe. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Create New Recipe</h2>
        </div>

        <div className="space-y-4">
          <FormInput
            type="text"
            label="Title"
            value={title}
            onChange={setTitle}
            placeholder="Enter recipe title"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter recipe description"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              rows={3}
            />
          </div>

          <FormInput
            type="text"
            label="Image URL"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="Enter image URL"
          />

          <FormInput
            type="text"
            label="Cooking Time (minutes)"
            value={cookTime}
            onChange={setCookTime}
            placeholder="Enter cooking time"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <div ref={searchContainerRef} className="relative mb-2">
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
                    setIsSearchOpen(true);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) {
                      handleIngredientSelect(searchTerm.trim());
                    }
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Add an ingredient"
                  className="w-full pl-10 pr-16 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
                <Button
                  type="button"
                  onClick={() => searchTerm.trim() && handleIngredientSelect(searchTerm.trim())}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  variant="ghost"
                  size="sm"
                >
                  <Plus size={20} />
                </Button>
              </div>

              {isSearchOpen && searchTerm.length > 1 && (
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
                                type="button"
                                onClick={() => handleIngredientSelect(ingredient.name)}
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

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary-dark rounded-full hover:bg-secondary/20 transition-colors"
                  >
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-0.5 hover:bg-secondary/30 rounded-full transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Instructions
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddInstruction}
                className="text-secondary hover:bg-secondary/10"
              >
                <Plus size={16} className="mr-1" />
                Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                      required
                    />
                  </div>
                  {instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveInstruction(index)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Minus size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-gray-500"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-secondary to-primary text-white"
          >
            {isSubmitting ? 'Creating...' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}