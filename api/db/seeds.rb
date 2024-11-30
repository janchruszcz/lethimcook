# Clear existing data
puts "Clearing existing data..."
Recipe.destroy_all
Ingredient.destroy_all

def parse_ingredient(ingredient_str)
  # Extract just the ingredient name without measurements
  ingredient_str.gsub(/^[\d\s\/½¼¾⅓⅔⅛⅜⅝⅞]+/, '').
                 gsub(/cup[s]?|teaspoon[s]?|tablespoon[s]?|ounce[s]?|pound[s]?|gram[s]?|ml|g|oz|lb|tsp|tbsp/i, '').
                 strip
end

# Create recipes
recipes_data = [
  {
    title: "Golden Sweet Cornbread",
    instructions: [
      "Preheat oven to 400 degrees F (200 degrees C). Spray or lightly grease a 9 inch round cake pan.",
      "In a large bowl, combine flour, cornmeal, sugar, salt and baking powder.",
      "Stir in egg, milk and vegetable oil until well combined.",
      "Pour batter into prepared pan.",
      "Bake in preheated oven for 20 to 25 minutes, or until a toothpick inserted into the center comes out clean."
    ],
    image_url: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2021%2F10%2F26%2Fcornbread-1.jpg",
    cook_time: 25,
    prep_time: 10,
    ratings: 4.74,
    cuisine: "American",
    category: "Bread",
    author: "bluegirl",
    raw_ingredients: [
      "1 cup all-purpose flour",
      "1 cup yellow cornmeal",
      "⅔ cup white sugar",
      "1 teaspoon salt",
      "3 ½ teaspoons baking powder",
      "1 egg",
      "1 cup milk",
      "⅓ cup vegetable oil"
    ]
  }
]

puts "Creating recipes and ingredients..."
recipes_data.each do |recipe_data|
  raw_ingredients = recipe_data.delete(:raw_ingredients)
  recipe = Recipe.create!(recipe_data)
  
  raw_ingredients.each do |raw_ingredient|
    ingredient_name = parse_ingredient(raw_ingredient)
    ingredient = Ingredient.find_or_create_by!(name: ingredient_name)
    RecipeIngredient.create!(recipe: recipe, ingredient: ingredient)
  end
end

puts "Seed completed successfully!"