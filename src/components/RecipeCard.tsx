import React, { useState } from 'react';
import { Clock, Users, UtensilsCrossed, X } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
          {recipe.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h4>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient) => (
              <span
                key={ingredient.id}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors"
              >
                {ingredient.name}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={18} className="text-blue-500" />
            <span>{recipe.cookingTime} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={18} className="text-blue-500" />
            <span>{recipe.servings} servings</span>
          </div>
          <button
            onClick={() => setShowInstructions(true)}
            className="ml-auto flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
          >
            <UtensilsCrossed size={18} />
            <span>Cook Now</span>
          </button>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{recipe.title}</h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-lg mb-4">Cooking Instructions</h4>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}