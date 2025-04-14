import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Plus, Minus, Search as SearchIcon, X } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { useQuery } from 'react-query';
import { searchIngredients } from '../../api/ingredients';
import { useDebounce } from '../../hooks/useDebounce';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Recipe } from '../../types';

interface RecipeFormProps {
  initialData?: Partial<Recipe>;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
}

export function RecipeForm({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting,
  submitButtonText
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [imageUrl, setImageUrl] = useState(initialData.main_image || '');
  const [prepTime, setPrepTime] = useState(initialData.prep_time?.toString() || '');
  const [cookTime, setCookTime] = useState(initialData.cook_time?.toString() || '');
  const [ingredients, setIngredients] = useState<string[]>(initialData.ingredient_entries || []);
  const [instructions, setInstructions] = useState(initialData.instructions || ['']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
      // Create a preview URL for the image
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Append recipe data
    formData.append('recipe[title]', title);
    formData.append('recipe[description]', description);
    if (prepTime) formData.append('recipe[prep_time]', prepTime);
    if (cookTime) formData.append('recipe[cook_time]', cookTime);
    
    // Append ingredients and instructions as arrays
    ingredients.filter(i => i.trim() !== '').forEach(ingredient => {
      formData.append('recipe[ingredient_entries][]', ingredient);
    });
    
    instructions.filter(i => i.trim() !== '').forEach(instruction => {
      formData.append('recipe[instructions][]', instruction);
    });
    
    // Append image if available
    if (mainImage) {
      formData.append('recipe[main_image]', mainImage);
    } else if (imageUrl && (!initialData.main_image || imageUrl !== initialData.main_image)) {
      formData.append('recipe[image_url]', imageUrl);
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Choose File
            </Button>
            <span className="text-sm text-gray-500">
              {mainImage ? mainImage.name : 'No file chosen'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {imageUrl && (
            <div className="mt-2">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="h-40 w-auto object-cover rounded-md" 
              />
            </div>
          )}
        </div>

        <FormInput
          type="text"
          label="Prep Time"
          value={prepTime}
          onChange={setPrepTime}
          placeholder="Enter prep time"
        />

        <FormInput
          type="text"
          label="Cook Time"
          value={cookTime}
          onChange={setCookTime}
          placeholder="Enter cook time"
        />

        {/* Ingredients section */}
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
                    e.preventDefault();
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

            {/* Suggestions dropdown */}
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

        {/* Instructions section */}
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
                <div className="flex-1 flex gap-2 items-center">
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
          onClick={() => window.history.back()}
          className="text-gray-500"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-secondary to-primary text-white"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
