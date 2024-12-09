class Api::V1::RecipesController < ApplicationController
  def index
    @recipes = Recipe.all

    if params[:ingredients].present?
      ingredient_names = params[:ingredients].split(',').map(&:strip)
      @recipes = @recipes.with_ingredients(ingredient_names)
    end
    
    pagy, @recipes = pagy(@recipes)

    render json: Panko::Response.new(
      success: true,
      recipes: Panko::ArraySerializer.new(
        @recipes,
        each_serializer: RecipeSerializer,
      ),
      pagination: {
        page: pagy.page,
        pages: pagy.pages,
        count: pagy.count,
        items: 9
      }
    )
  end

  def show
    @recipe = Recipe.find(params[:id])
    
    render(
      json: Panko::Response.create do |r|
        {
          success: true,
          recipe: r.serializer(@recipe, RecipeSerializer)
        }
      end
    )
  end
end
