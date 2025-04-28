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
    begin
      response = AnthropicAiService.generate_recipe(@ingredients)
      #puts "Response: #{response}"
      
      recipe_text = response["content"].first["text"]
      #puts "Recipe text: #{recipe_text}"
      
      # Extract JSON from code blocks if present
      if recipe_text.include?("```json")
        # Extract the JSON part between the code block markers
        json_match = recipe_text.match(/```json\s*(.+?)```/m)
        recipe_text = json_match[1].strip if json_match
      end
      
      raise "Invalid recipe format" unless recipe_text.present?
      recipe_data = JSON.parse(recipe_text)
      raise "Invalid recipe structure" unless valid_recipe?(recipe_data)

      update_recipe(recipe_data)
      @recipe
    rescue JSON::ParserError => e
      handle_error("Failed to parse recipe: #{e.message}")
    rescue StandardError => e
      handle_error("Recipe generation error: #{e.message}")
    end
  end

  private

  def update_recipe(recipe_data)
    recipe_attributes = recipe_data.slice(
      'title', 'description', 'ingredient_entries', 'instructions',
      'cuisine', 'category', 'prep_time', 'cook_time', 'author'
    )
    
    recipe_attributes['status'] = :completed
    #puts "Recipe attributes: #{recipe_attributes.inspect}"
    generate_image(recipe_data['title']) if recipe_data['title'].present?
    #puts "Recipe: #{@recipe.inspect}"
    @recipe.update!(recipe_attributes) if @recipe.main_image.attached?
  rescue => e
    Rails.logger.error("Recipe update error: #{e.message}")
    handle_error("Failed to update recipe: #{e.message}")
    raise
  end

  def generate_image(recipe_title)
    begin
      image_url = RecipeImageGenerator.generate(recipe_title)
      puts "Image URL: #{image_url}"
        
      return nil if image_url.blank?

      # Download the image from the URL with proper headers
      require 'open-uri'
      downloaded_image = URI.open(
        image_url,
        'User-Agent' => 'LetHimCook Recipe App',
        'Accept' => 'image/jpeg,image/png,image/*'
      )
      
      # Generate a unique filename
      filename = "#{recipe_title.parameterize}-#{Time.now.to_i}.jpg"
      
      # Attach the image to the recipe
      @recipe.main_image.attach(
        io: downloaded_image,
        filename: filename,
        content_type: 'image/jpeg'
      )
      
      puts "Image successfully attached for recipe #{@recipe.id}"
    rescue OpenURI::HTTPError => e
      puts "Failed to download image: #{e.message}"
    rescue StandardError => e
      puts "Error attaching image: #{e.message}"
      puts e.backtrace.join("\n")
    end
    
    nil
  end

  def handle_error(message)
    @recipe.update!(
      status: "failed",
    )
    render json: { error: message }, status: :unprocessable_entity
  end

  def valid_recipe?(recipe)
    required_fields = %w[title description ingredient_entries instructions]
    required_fields.all? { |field| recipe[field].present? }
  end
end
