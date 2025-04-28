class Api::V1::AiChefController < ApplicationController
  before_action :authenticate_user!

  def generate_recipe
    @recipe = Recipe.create!(
      title: 'New AI Recipe (Pending)',
      status: 'pending',
      user: current_user,
      instructions: ['Let me cook...']
    )

    GenerateRecipeJob.perform_later(params[:ingredients], @recipe.id)

    render_success(@recipe, :created)
  end

  def recipe_status
    @recipe = Recipe.find(params[:recipe_id])
    render_success(@recipe)
  end

  private

  def render_success(data, status = :ok)
    render(json: Panko::Response.create do |r|
      {
        success: true,
        data: r.serializer(data, RecipeSerializer, context: { current_user: current_user })
      }
    end, status: status)
  end
end