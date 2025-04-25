class RecipeImageGenerator
  # Generate recipe image using either Unsplash (stock photos) or Runware.ai (AI-generated)
  # @param recipe_title [String] title of the recipe
  # @return [String] url of the generated image
  
  def self.generate(recipe_title)
    image_url = RunwareAiService.generate_image(recipe_title)
    
    image_url ? image_url : search_image(recipe_title)
  end

  private

  def self.search_image(recipe_title)
    image = Unsplash::Photo.random(query: recipe_title)
    image.urls.full
  end
end