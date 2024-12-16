class Api::V1::AiChefController < ApplicationController
  wrap_parameters false

  def generate_recipe
    client = Anthropic::Client.new

    response = client.messages(
      parameters: {
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0.5,
        messages: [
          {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "You are an expert chef, like Anthony Bourdain, tasked with creating a unique and delicious recipe based on the ingredients provided by the user. Your goal is to craft a recipe that is creative, flavorful, and feasible to prepare.\n\nThe user will provide you with a list of ingredients:\n\n<ingredients>\n#{params[:ingredients]}\n</ingredients>\n\nUsing these ingredients as inspiration, create a recipe with the following structure:\n\n1. Title: Create a catchy and descriptive title for the dish.\n\n2. Description: Write a brief, enticing description of the dish in 2-3 sentences.\n\n3. Ingredient_entries: List all the ingredients needed, including quantities. Use the provided ingredients as a base, but feel free to add common pantry items or additional ingredients that would complement the dish. Each ingredient should be on a new line.\n\n4. Instructions: Provide clear, step-by-step instructions for preparing the dish. Each step should be on a new line.\n\n5. Image URL: Search unsplash.com for an image corresponding to the recipe\n\n6. Prep time: Estimate the preparation time in minutes.\n\n7. Cook time: Estimate the cooking time in minutes.\n\n8. Ratings: Use a placeholder value of 4.5 (assuming the recipe would be well-received).\n\n9. Cuisine: Determine the most appropriate cuisine category for the dish (e.g., Italian, Mexican, Asian, etc.).\n\n10. Category: Assign a category to the dish (e.g., Main Course, Appetizer, Dessert, etc.).\n\n11. Author: Use \"Jesse\" as the author.\n\nPresent your recipe in the JSON format, return ONLY recipe in JSON.\n\nRemember to be creative and think like a professional chef when crafting this recipe. Consider flavor combinations, cooking techniques, and presentation that would make this dish stand out."
                }
            ]
          }
        ]
      }
    ) 

    # puts response.inspect

    recipe_text = response["content"].first["text"]
    # puts "recipe_text: #{recipe_text}"
    render json: JSON.parse(recipe_text)
  end
end
