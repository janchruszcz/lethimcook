class RecipeImageGenerator

  # TODO: Implement image generation, consider hybrid approach - mix of AI and stock images

  def self.generate(recipe_title)
    image = Unsplash::Photo.random(query: recipe_title)
    image.urls.full
  end
end