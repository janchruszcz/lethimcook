class GenerateRecipeJob < ApplicationJob
  queue_as :default

  def perform(ingredients)
    puts "Generating recipe for ingredients: #{ingredients}"
    recipe = RecipeGenerator.new(ingredients).generate
    self.result = recipe
  end
end

