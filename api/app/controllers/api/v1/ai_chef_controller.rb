class Api::V1::AiChefController < ApplicationController

  def generate_recipe
    recipe = Recipe.create!(
      title: 'New Recipe',
      status: 'pending'
    )
    
    GenerateRecipeJob.perform_later(params[:ingredients], recipe.id)
    
    render json: { 
      recipeId: recipe.id,
      message: 'Recipe generation started'
    }
  end

  def recipe_status
    recipe = Recipe.find_by(id: params[:recipe_id])
    
    if recipe.nil?
      render json: { status: 'failed', error: 'Recipe not found' }
    else
      render json: { recipe: recipe }
    end
  end
end