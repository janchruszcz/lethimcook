class Api::V1::RecipesController < ApplicationController
  def index
    @recipes = Recipe.includes(:favorites)

    @recipes = RecipeFilterQuery.new(params, @recipes, current_user).call
    
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
    render_success(@recipe)
  end

  def create
    @recipe = current_user.recipes.build(recipe_params)
    @recipe.save!
    render_success(@recipe, :created)
  end

  def update
    @recipe = current_user.recipes.find(params[:id])
    @recipe.update!(recipe_params)
    render_success(@recipe)
  end

  def destroy
    @recipe = current_user.recipes.find(params[:id])
    @recipe.destroy!
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

  def recipe_params
    params.expect(recipe: [:title, 
                           :description, 
                           :image_url, 
                           :prep_time, 
                           :cook_time, 
                           :cuisine, 
                           :category, 
                           :author, 
                           :main_image,
                           :ingredient_entries => [],
                           :instructions => []])
  end
  
end
