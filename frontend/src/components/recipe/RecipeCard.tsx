import React, { useState } from 'react';
import { Clock, Eye, Trash, Edit } from 'lucide-react';
import { Recipe } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FavoriteButton } from '../FavoriteButton';
import { RecipeModal } from './RecipeModal';
import { EditRecipeModal } from './EditRecipeModal';
import { toggleRecipeFavorite } from '../../api/favorites';
import { useToastStore } from '../../stores/toastStore';
interface RecipeCardProps {
  recipe: Recipe;
  onDeleteRecipe: (recipeId: number) => Promise<void>;
}

export function RecipeCard({ recipe, onDeleteRecipe }: RecipeCardProps) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(recipe.is_favorite || false);
  const { showToast } = useToastStore();

  const handleFavoriteToggle = async () => {
    try {
      await toggleRecipeFavorite(recipe.id, isFavorited);
      setIsFavorited(!isFavorited);
      showToast('My favorite!', 'success')
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await onDeleteRecipe(recipe.id);
      showToast('Recipe deleted', 'error');

    } catch(error) {
      console.error('Failed to remove recipe:', error);
    }
  };

  return (
    <>
      <Card className="group bg-white shadow-md transform hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-40">
          <img
            src={recipe.main_image || 'https://chilitonka.com/wp-content/uploads/2013/09/curry-ct2867.jpg'}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-t-xl"
          />
          <div className="absolute top-2 right-2">
            <FavoriteButton
              isFavorited={isFavorited}
              onToggle={handleFavoriteToggle}
              className="bg-white/90 hover:bg-white"
            />
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-primary group-hover:text-primary-light transition-colors line-clamp-1">
              {recipe.title}
            </h3>
          </div>

          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredient_entries?.slice(0, 3).map((ingredient) => (
                <Badge key={ingredient.id} variant="secondary" className="text-xs px-2 py-0.5">
                  {ingredient}
                </Badge>
              ))}
              {recipe.ingredient_entries?.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{recipe.ingredient_entries.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center gap-4 text-xs text-gray-500">
            {recipe.total_time > 0 && (
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-primary-light" />
                <span>{recipe.total_time}m</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeleteRecipe}
                className="ml-auto text-xs"
              >
                <Trash size={16} />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowEditModal(true)}
                className="ml-auto text-xs"
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowViewModal(true)}
                className="ml-auto text-xs"
              >
                <Eye size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showViewModal && (
        <RecipeModal
          recipe={recipe}
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorited={isFavorited}
        />
      )}
      
      {showEditModal && (
        <EditRecipeModal
          recipe={recipe}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}