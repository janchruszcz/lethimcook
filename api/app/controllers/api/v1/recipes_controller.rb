class Api::V1::RecipesController < ApplicationController
  def index
    @recipes = Recipe.includes(:favorites)

    if params[:my_recipes] == 'true'
      @recipes = @recipes.where(user: current_user)
    end

    if params[:favorites] == 'true'
      @recipes = @recipes.where(favorites: { user: current_user })
    end

    if params[:ingredients].present?
      ingredient_names = params[:ingredients].split(',').map(&:strip)
      if params[:exact] == 'true'
        @recipes = @recipes.with_exact_ingredients(ingredient_names)
      else
        @recipes = @recipes.search_by_ingredient_entries(ingredient_names)
      end
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
          recipe: r.serializer(@recipe, RecipeSerializer, context: { current_user: current_user })
        }
      end
    )
  end

  def create
    @recipe = current_user.recipes.build(recipe_params)
    
    if @recipe.save
      render(
        json: Panko::Response.create do |r|
          {
            success: true,
            recipe: r.serializer(@recipe, RecipeSerializer, context: { current_user: current_user })
          }
        end
      )
    else
      render json: { success: false, errors: @recipe.errors }, status: :unprocessable_entity
    end
  end

  def update
    @recipe = current_user.recipes.find(params[:id])
    
    if @recipe.update(recipe_params)
      render(
        json: Panko::Response.create do |r|
          {
            success: true,
            recipe: r.serializer(@recipe, RecipeSerializer, context: { current_user: current_user })
          }
        end
      )
    else
      render json: { success: false, errors: @recipe.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @recipe = current_user.recipes.find(params[:id])
    @recipe.destroy
    render json: { success: true }
  end

  private

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
