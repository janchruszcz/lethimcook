
class Api::V1::FavoritesController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @favorite_recipes = current_user.favorite_recipes

    pagy, @favorite_recipes = pagy(@favorite_recipes)

    render json: Panko::Response.new(
      success: true,
      recipes: Panko::ArraySerializer.new(
        @favorite_recipes,
        each_serializer: RecipeSerializer,
        context: {
          current_user: current_user
        }
      ),
      pagination: {
        page: pagy.page,
        pages: pagy.pages,
        count: pagy.count,
        items: pagy.limit
      }
    )
  end

  def create
    recipe = Recipe.find(params[:recipe_id])
    current_user.favorites.create!(recipe: recipe)
    render json: Panko::Response.new(
      success: true,
      favorited: true
    )
  end

  def destroy
    recipe = Recipe.find(params[:id])
    current_user.favorites.find_by(recipe: recipe).destroy
    render json: Panko::Response.new(
      success: true,
      favorited: false
    )
  end
end
