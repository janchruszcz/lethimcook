class AnthropicAiService
  # Generate a recipe using Anthropic AI
  # @param ingredients [Array] ingredients for the recipe
  # @return [String] generated recipe
  
  def self.generate_recipe(ingredients)
    client = Anthropic::Client.new
    client.messages(
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
                "text": recipe_prompt(ingredients)
              }
            ]
          }
        ]
      }
    )
  end
  
  def self.recipe_prompt(ingredients)
    "You are an expert chef, like Anthony Bourdain, tasked with creating a unique and delicious recipe based on the ingredients provided by the user. 
    Your goal is to craft a recipe that is creative, flavorful, and feasible to prepare.
    The user will provide you with a list of ingredients:
    <ingredients>
    #{ingredients}
    </ingredients>
    Using these ingredients as inspiration, create a recipe with the following structure:
    1. Title: Create a catchy and descriptive title for the dish.
    2. Description: Write a brief, enticing description of the dish in 2-3 sentences.
    3. Ingredient_entries: List all the ingredients needed, including quantities. Use the provided ingredients as a base, but feel free to add common pantry items or additional ingredients that would complement the dish. Each ingredient should be on a new line.
    4. Instructions: Provide a step-by-step guide for preparing the dish. Each step should be on a new line.
    5. Cuisine: Specify the cuisine or culinary style of the dish.
    6. Category: Specify the category of the dish (e.g. main dish, dessert, etc.).
    7. Prep_time: Specify the preparation time for the dish in minutes.
    8. Cook_time: Specify the cooking time for the dish in minutes.
    9. Author: Mario.
    Ensure the recipe is feasible to prepare and uses the ingredients provided.
    Return the recipe in JSON format."
  end
end
