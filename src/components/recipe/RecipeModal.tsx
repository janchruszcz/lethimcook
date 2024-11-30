import React from 'react';
import { X } from 'lucide-react';
import { Recipe } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-primary">{recipe.title}</h3>
            <Button
              variant="ghost"
              icon={X}
              onClick={onClose}
              className="p-2"
              aria-label="Close"
            />
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="font-semibold text-lg mb-4 text-primary">Cooking Instructions</h4>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-secondary/20 text-secondary-dark rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">{instruction}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}