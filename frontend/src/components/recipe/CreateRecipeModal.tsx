import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useToastStore } from '../../stores/toastStore';
import { useRecipeStore } from '../../stores/useRecipeStore';
import { RecipeForm } from './RecipeForm';
import { useQueryClient } from 'react-query';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRecipeModal({ isOpen, onClose }: CreateRecipeModalProps) {
  const { showToast } = useToastStore();
  const { createRecipe, filters } = useRecipeStore();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createRecipe(formData);
      queryClient.invalidateQueries(['recipes', filters]);
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
      <div className="flex items-center justify-between p-6 pb-0">
        <h2 className="text-2xl font-semibold text-gray-900">Create New Recipe</h2>
      </div>
      <RecipeForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText={isSubmitting ? 'Creating...' : 'Create'}
      />
    </Modal>
  );
}