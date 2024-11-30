module Api
  module V1
    class RecipesController < ApplicationController
      def index
        @recipes = Recipe.all
        
        if params[:ingredients].present?
          ingredient_names = params[:ingredients].split(',').map(&:strip)
          @recipes = Recipe.joins(:ingredients)
                          .where(ingredients: { name: ingredient_names })
                          .group('recipes.id')
                          .having('COUNT(DISTINCT ingredients.id) >= ?', ingredient_names.size)
                          .select('recipes.*')
        else
          @recipes = Recipe.includes(:ingredients)
        end

        if params[:cuisine].present?
          @recipes = @recipes.where(cuisine: params[:cuisine])
        end

        if params[:category].present?
          @recipes = @recipes.where(category: params[:category])
        end
        
        render json: @recipes
      end

      def show
        @recipe = Recipe.includes(:ingredients).find(params[:id])
        render json: @recipe
      end
    end
  end
end