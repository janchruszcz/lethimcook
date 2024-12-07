
class Api::V1::FavoritesController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @favorites = current_user.favorite_recipes

    render json: Panko::ArraySerializer.new(
      @favorites,
      each_serializer: RecipeSerializer,
    ).to_json
  end

  def create
    recipe = Recipe.find(params[:recipe_id])
    current_user.favorites.create!(recipe: recipe)
    render json: { favorited: true }
  end

  def destroy
    recipe = Recipe.find(params[:id])
    current_user.favorites.find_by(recipe: recipe).destroy
    render json: { favorited: false }
  end
end