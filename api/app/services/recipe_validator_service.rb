class RecipeValidatorService
  def self.validate(recipe)
    return validation_result(false, "Recipe embedding not found") unless recipe.embedding.present?
    
    # Find similar recipes for comparison
    similar_recipes = RecipeEmbeddingService.find_similar_recipes(recipe, limit: 3)
    
    # Prepare context from similar recipes
    context = prepare_context(similar_recipes)
    
    # Validate using Anthropic
    validation = perform_rag_validation(recipe, context)
    
    # Parse and return the validation result
    parse_validation_result(validation)
  end
  
  private
  
  def self.prepare_context(recipes)
    recipes.map do |recipe|
      {
        title: recipe.title,
        ingredients: recipe.ingredient_entries,
        instructions: recipe.instructions,
        cuisine: recipe.cuisine,
        category: recipe.category
      }
    end
  end
  
  def self.perform_rag_validation(recipe, context)
    client = Anthropic::Client.new
    response = client.messages(
      parameters: {
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: validation_prompt(recipe, context)
              }
            ]
          }
        ]
      }
    )
    
    response.dig("content", 0, "text")
  end
  
  def self.validation_prompt(recipe, context)
    <<~PROMPT
      You are a culinary expert tasked with validating a recipe for accuracy, completeness, and feasibility.
      
      Here's the recipe to validate:
      
      Title: #{recipe.title}
      Description: #{recipe.description}
      Ingredients: #{recipe.ingredient_entries.join("\n")}
      Instructions: #{recipe.instructions.join("\n")}
      Cuisine: #{recipe.cuisine}
      Category: #{recipe.category}
      
      For context, here are some similar recipes:
      #{format_context(context)}
      
      Please validate this recipe for:
      1. Ingredient completeness (are all necessary ingredients listed?)
      2. Instruction completeness (are all necessary steps included?)
      3. Culinary accuracy (do the cooking techniques make sense?)
      4. Feasibility (is this recipe practical to make?)
      
      Return your response as a JSON object with the following format:
      {
        "valid": true/false,
        "score": (1-100),
        "issues": ["issue1", "issue2", ...],
        "suggestions": ["suggestion1", "suggestion2", ...]
      }
    PROMPT
  end
  
  def self.format_context(context)
    context.map do |recipe|
      <<~RECIPE
        Recipe: #{recipe[:title]}
        Ingredients: #{recipe[:ingredients].join(", ")}
        Instructions: #{recipe[:instructions].join(" ")}
        Cuisine: #{recipe[:cuisine]}
        Category: #{recipe[:category]}
      RECIPE
    end.join("\n\n")
  end
  
  def self.parse_validation_result(text)
    begin
      # Extract JSON from the response
      if text.include?("```json")
        json_match = text.match(/```json\s*(.+?)```/m)
        text = json_match[1].strip if json_match
      end
      
      result = JSON.parse(text)
      
      validation_result(
        result["valid"], 
        nil, 
        result["score"], 
        result["issues"], 
        result["suggestions"]
      )
    rescue JSON::ParserError => e
      validation_result(false, "Failed to parse validation result: #{e.message}")
    end
  end
  
  def self.validation_result(valid, error = nil, score = nil, issues = [], suggestions = [])
    {
      valid: valid,
      error: error,
      score: score,
      issues: issues,
      suggestions: suggestions
    }
  end
end 