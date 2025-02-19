import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create recipe
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingredients
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddIngredient}
                className="text-secondary hover:bg-secondary/10"
              >
                <Plus size={16} className="mr-1" />
                Add Ingredient
              </Button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    required
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Minus size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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