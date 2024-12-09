class Api::V1::RecipesController < ApplicationController
  def index
    @recipes = Recipe.includes(:favorites)
                     .where(favorites: { user_id: current_user&.id })

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
