module Api
  module V1
    class RecipesController < ApplicationController
      def index
        @recipes = Recipe.includes(:ingredients)

        @recipes = if params[:ingredients].present?
          ingredient_names = params[:ingredients].split(',').map(&:strip)
          @recipes.references(:ingredients).where(ingredients: { name: ingredient_names })
        end

        if params[:cuisine].present?
          @recipes = @recipes.where(cuisine: params[:cuisine])
        end

        if params[:category].present?
          @recipes = @recipes.where(category: params[:category])
        end
        
        render json: Panko::ArraySerializer.new(
          @recipes,
          each_serializer: RecipeSerializer,
        ).to_json
      end

      def show
        @recipe = Recipe.includes(:ingredients).find(params[:id])
        render json: @recipe
      end
    end
  end
end