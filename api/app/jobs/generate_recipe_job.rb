class GenerateRecipeJob < ApplicationJob
  queue_as :default

  def perform(ingredients, recipe_id)
    recipe = Recipe.find(recipe_id)

    begin
      recipe_data = RecipeGenerator.new(ingredients).generate
      
      recipe.update!(
        title: recipe_data['title'],
        description: recipe_data['description'],
        ingredient_entries: recipe_data['ingredient_entries'],
        # instructions: recipe_data['instructions'],
        cuisine: recipe_data['cuisine'],
        category: recipe_data['category'],
        prep_time: recipe_data['prep_time'],
        cook_time: recipe_data['cook_time'],
        # rating: recipe_data['rating'],
        author: recipe_data['author'],
        # image_url: recipe_data['image_url'],
        status: 1
      )
      
    rescue StandardError => e
      recipe.update!(
        status: 2,
        error_message: e.message
      )
      raise "Recipe generation failed: #{e.message}"
    end
  end
end

