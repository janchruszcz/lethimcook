class RecipeSimilarityService
  def self.find_similar_by_text(query_text, limit: 5)
    # Generate embedding for the query text
    embedding = RecipeEmbeddingService.generate_embedding(query_text)
    return [] unless embedding.present?
    
    # Find recipes with similar embedding
    Recipe.where.not(embedding: nil)
          .order(Arel.sql("embedding <-> '#{embedding}'"))
          .limit(limit)
  end
  
  def self.find_similar_by_ingredients(ingredients, limit: 5)
    # Convert ingredients to a string for embedding
    ingredients_text = ingredients.join(", ")
    
    # Get an embedding for the ingredients
    embedding = RecipeEmbeddingService.generate_embedding(ingredients_text)
    return [] unless embedding.present?
    
    # Find recipes with similar embedding
    Recipe.where.not(embedding: nil)
          .order(Arel.sql("embedding <-> '#{embedding}'"))
          .limit(limit)
  end
  
  def self.find_similar_to_recipe(recipe, limit: 5)
    # Use the embedding service to find similar recipes
    RecipeEmbeddingService.find_similar_recipes(recipe, limit: limit)
  end
end 