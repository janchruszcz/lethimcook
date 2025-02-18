class GenerateRecipeJob < ApplicationJob
  queue_as :default

  def perform(ingredients, recipe_id)
    RecipeGenerator.new(ingredients, recipe_id).generate
  end
end

