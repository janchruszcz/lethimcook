class Api::V1::AiChefController < ApplicationController

  def generate_recipe
    recipe = Recipe.create!(title: 'New Recipe', status: 'pending', user_id: current_user.id)

    GenerateRecipeJob.perform_later(params[:ingredients], recipe.id)

    render json: { status: 'success', recipeId: recipe.id, message: 'Recipe generation started' }
  end

  def recipe_status
    recipe = Recipe.find_by(id: params[:recipe_id])

    if recipe
      render json: { status: 'success', recipe: recipe }
    else
      render json: { status: 'failed', error: 'Recipe not found' }, status: :not_found
    end
  end
end