module Api
  module V1
    class IngredientsController < ApplicationController
      def index
        @ingredients = Ingredient.all
        render json: @ingredients
      end
    end
  end
end