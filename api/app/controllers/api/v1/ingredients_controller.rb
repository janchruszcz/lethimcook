class Api::V1::IngredientsController < ApplicationController
  def index
    @ingredients = Ingredient.all
    render json: @ingredients
  end

  def search
    query = params[:q]&.downcase
    @ingredients = Ingredient.where('name ILIKE ?', "%#{query}%")
    
    render json: @ingredients
  end
end