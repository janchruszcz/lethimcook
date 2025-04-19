class Api::V1::FavoritesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_recipe, only: [:create, :destroy]

  def create
    if current_user.favorites.create!(recipe: @recipe)
      render json: Panko::Response.new(
        success: true
      )
    else
      render json: Panko::Response.new(
        success: false,
        error: "Failed to favorite recipe"
      )
    end
  end

  def destroy
    favorite = current_user&.favorites&.find_by(recipe: @recipe)

    if favorite
      begin
        favorite.destroy!
        render json: Panko::Response.new(
          success: true
        )
      rescue ActiveRecord::RecordNotDestroyed => e
        render json: Panko::Response.new(
          success: false,
          error: "Failed to unfavorite recipe: #{e.message}"
        ), status: :unprocessable_entity
      end
    else
      render json: Panko::Response.new(
        success: false,
        error: "Favorite not found"
      ), status: :not_found
    end
  end

  private

  def set_recipe
    @recipe = Recipe.find(params[:id])
  end
end
