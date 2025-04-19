import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useToastStore } from '../../stores/toastStore';
import { useRecipeStore } from '../../stores/useRecipeStore';
import { RecipeForm } from './RecipeForm';
import { Recipe } from '../../types';
import { useQueryClient } from 'react-query';

interface EditRecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export function EditRecipeModal({ recipe, isOpen, onClose }: EditRecipeModalProps) {
  const { showToast } = useToastStore();
  const { updateRecipe, filters } = useRecipeStore();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await updateRecipe(recipe.id, formData);
      queryClient.invalidateQueries(['recipes', filters]);
      showToast('Recipe updated successfully!', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to update recipe. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex items-center justify-between p-6 pb-0">
        <h2 className="text-2xl font-semibold text-gray-900">Edit Recipe</h2>
      </div>
      <RecipeForm
        initialData={recipe}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText={isSubmitting ? 'Saving...' : 'Update'}
      />
    </Modal>
  );
} 