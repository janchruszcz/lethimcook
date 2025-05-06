module Api
  module V1
    class SimilarRecipesController < ApplicationController
      def index
        recipe = Recipe.find(params[:recipe_id])
        similar_recipes = recipe.similar_recipes(limit: limit_param)
        
        render json: PankoSerializer.serialize(similar_recipes, each_serializer: RecipeSerializer)
      end
      
      def by_ingredients
        ingredients = params[:ingredients] || []
        similar_recipes = RecipeSimilarityService.find_similar_by_ingredients(ingredients, limit: limit_param)
        
        render json: PankoSerializer.serialize(similar_recipes, each_serializer: RecipeSerializer)
      end
      
      def by_query
        query = params[:query]
        similar_recipes = RecipeSimilarityService.find_similar_by_text(query, limit: limit_param)
        
        render json: PankoSerializer.serialize(similar_recipes, each_serializer: RecipeSerializer)
      end
      
      private
      
      def limit_param
        [params.fetch(:limit, 5).to_i, 20].min
      end
    end
  end
end 