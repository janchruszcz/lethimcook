class RecipeGenerator
  # Generate a recipe using Anthropic AI & Runware.ai
  # @param ingredients [Array] ingredients for the recipe
  # @param recipe_id [Integer] id of the recipe
  # @return [Recipe] generated recipe

  def initialize(ingredients, recipe_id)
    @ingredients = ingredients
    @recipe = Recipe.find(recipe_id)
  end

  def generate
    return failure_result("No ingredients provided") if @ingredients.blank?
    
    recipe_data = fetch_recipe_data
    return recipe_data if recipe_data.failure?
    
    update_result = update_recipe(recipe_data.value)
    return update_result if update_result.failure?
    
    Success.new(@recipe)
  end

  private

  def fetch_recipe_data
    response = AnthropicAiService.generate_recipe(@ingredients)
    recipe_text = extract_recipe_text(response)
    
    return Failure.new("Invalid recipe format") unless recipe_text.present?
    
    begin
      recipe_data = JSON.parse(recipe_text)
      return Failure.new("Invalid recipe structure") unless valid_recipe?(recipe_data)
      Success.new(recipe_data)
    rescue JSON::ParserError => e
      Failure.new("Failed to parse recipe: #{e.message}")
    end
  end

  def extract_recipe_text(response)
    recipe_text = response["content"].first["text"]
    
    if recipe_text.include?("```json")
      json_match = recipe_text.match(/```json\s*(.+?)```/m)
      recipe_text = json_match[1].strip if json_match
    end
    
    recipe_text
  end

  def update_recipe(recipe_data)
    recipe_attributes = recipe_data.slice(
      'title', 'description', 'ingredient_entries', 'instructions',
      'cuisine', 'category', 'prep_time', 'cook_time', 'author'
    )
    recipe_attributes['status'] = :completed
    
    image_result = generate_image(recipe_data['title']) if recipe_data['title'].present?
    return image_result if image_result&.failure?
    
    begin
      @recipe.update!(recipe_attributes) if @recipe.main_image.attached?
      Success.new(@recipe)
    rescue => e
      Rails.logger.error("Recipe update error: #{e.message}")
      @recipe.update(status: :failed)
      Failure.new("Failed to update recipe: #{e.message}")
    end
  end

  def generate_image(recipe_title)
    image_url = RecipeImageGenerator.generate(recipe_title)
    return Failure.new("Failed to generate image") if image_url.blank?

    begin
      require 'open-uri'
      downloaded_image = URI.open(
        image_url,
        'User-Agent' => 'LetHimCook Recipe App',
        'Accept' => 'image/jpeg,image/png,image/*'
      )
      
      filename = "#{recipe_title.parameterize}-#{Time.now.to_i}.jpg"
      
      @recipe.main_image.attach(
        io: downloaded_image,
        filename: filename,
        content_type: 'image/jpeg'
      )
      
      Success.new(true)
    rescue => e
      Rails.logger.error("Image generation error: #{e.message}")
      Failure.new("Failed to process image: #{e.message}")
    end
  end

  def valid_recipe?(recipe)
    required_fields = %w[title description ingredient_entries instructions]
    required_fields.all? { |field| recipe[field].present? }
  end

  def failure_result(message)
    Failure.new(message)
  end
end

