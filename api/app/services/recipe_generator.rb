class RecipeGenerator
  def initialize(ingredients, recipe_id)
    @ingredients = ingredients
    @recipe = Recipe.find(recipe_id)
  end

  def generate
    begin
      response = AiClientService.generate_recipe(@ingredients)
      puts "Response: #{response}"
      
      recipe_text = response["content"].first["text"]
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
    
    # First update the regular attributes
    @recipe.update!(recipe_attributes)
    
    # Then attach the image as a separate operation
    generate_image(recipe_data['title']) if recipe_data['title'].present?
    
    # Save to ensure the attachment is persisted
    @recipe.save! if @recipe.main_image.attached?
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
