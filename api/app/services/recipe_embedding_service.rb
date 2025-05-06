class RecipeEmbeddingService
  def self.generate_embedding(text)
    client = OpenAI::Client.new
    response = client.embeddings(
      parameters: {
        model: "text-embedding-3-small",
        input: text
      }
    )
    
    response.dig("data", 0, "embedding")
  rescue => e
    Rails.logger.error("Error generating embedding: #{e.message}")
    nil
  end
  
  def self.update_recipe_embedding(recipe)
    # Create a rich text representation of the recipe
    recipe_text = [
      recipe.title,
      recipe.description,
      recipe.ingredient_entries.join(', '),
      recipe.instructions.join(' '),
      recipe.cuisine,
      recipe.category
    ].compact.join(' ')
    
    embedding = generate_embedding(recipe_text)
    recipe.update(embedding: embedding) if embedding.present?
  end
  
  def self.find_similar_recipes(recipe, limit: 5)
    return [] if recipe.embedding.blank?
    
    Recipe.where.not(id: recipe.id)
          .where.not(embedding: nil)
          .order(Arel.sql("embedding <-> '#{recipe.embedding}'"))
          .limit(limit)
  end
end
