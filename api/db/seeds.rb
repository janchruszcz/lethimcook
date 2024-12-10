# Clear existing data
puts "Clearing existing data..."
Recipe.destroy_all
Ingredient.destroy_all


puts "Creating standardized ingredients..."

# Define ingredients with their categories
ingredients_with_categories = {
  'Proteins': [
    'chicken', 'beef', 'pork', 'lamb', 'turkey', 'bacon', 'ham', 'duck', 'quail',
    'shrimp', 'salmon', 'tuna', 'cod', 'tilapia', 'halibut', 'sea bass', 'trout',
    'mussels', 'clams', 'oysters', 'scallops', 'crab', 'lobster', 'octopus', 'squid',
    'tofu', 'tempeh', 'eggs'
  ],
  'Vegetables': [
    'garlic', 'onion', 'tomato', 'carrot', 'celery', 'potato', 'spinach', 'kale',
    'broccoli', 'cauliflower', 'mushroom', 'zucchini', 'bell pepper', 'cucumber',
    'lettuce', 'asparagus', 'brussels sprouts', 'cabbage', 'corn', 'sweet potato',
    'peas', 'green beans', 'artichoke', 'radish', 'turnip', 'beet', 'squash', 'pumpkin',
    'eggplant', 'red onion', 'green onion', 'shallot', 'leek', 'romaine lettuce',
    'iceberg lettuce', 'arugula', 'watercress', 'endive', 'radicchio', 'bok choy',
    'collard greens', 'mustard greens', 'swiss chard', 'fennel', 'kohlrabi', 'rutabaga',
    'parsnip', 'okra', 'jicama', 'water chestnuts', 'bamboo shoots', 'bean sprouts'
  ],
  'Fruits': [
    'apple', 'banana', 'strawberry', 'blueberry', 'raspberry', 'blackberry', 'orange',
    'grapefruit', 'pineapple', 'mango', 'papaya', 'coconut', 'lemon', 'lime',
    'dates', 'raisins', 'cranberry', 'fig', 'prune'
  ],
  'Grains and Pasta': [
    'pasta', 'rice', 'quinoa', 'couscous', 'barley', 'oats', 'millet', 'buckwheat',
    'amaranth', 'sorghum', 'wild rice', 'jasmine rice', 'basmati rice'
  ],
  'Dairy and Alternatives': [
    'butter', 'cream', 'milk', 'yogurt', 'sour cream', 'cream cheese',
    'feta', 'mozzarella', 'parmesan', 'cheddar', 'gouda', 'blue cheese', 'ricotta',
    'whipped cream', 'buttermilk', 'condensed milk', 'evaporated milk'
  ],
  'Herbs and Spices': [
    'salt', 'pepper', 'basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro',
    'bay leaf', 'sage', 'mint', 'dill', 'chives', 'paprika', 'cayenne', 'chili powder',
    'cinnamon', 'nutmeg', 'clove', 'ginger', 'turmeric', 'curry', 'cumin', 'coriander',
    'cardamom', 'saffron'
  ],
  'Nuts and Seeds': [
    'almond', 'walnut', 'pecan', 'cashew', 'peanut', 'hazelnut', 'pistachio',
    'chia seeds', 'flax seeds', 'pumpkin seeds', 'sunflower seeds', 'sesame seeds',
    'pine nuts', 'macadamia', 'brazil nuts'
  ],
  'Oils, Fats and Sauces': [
    'vinegar', 'olive oil', 'balsamic vinegar', 'red wine vinegar', 'chicken broth',
    'beef broth', 'vegetable broth', 'wine', 'red wine', 'white wine', 'rice wine',
    'sake', 'ghee', 'margarine', 'shortening', 'lard', 'soy sauce', 'tomato paste',
    'worcestershire sauce', 'fish sauce', 'oyster sauce', 'mustard', 'mayonnaise',
    'ketchup', 'tahini', 'hummus', 'pesto', 'wasabi', 'horseradish', 'guacamole',
    'salsa'
  ],
  'Baking and Sweeteners': [
    'flour', 'sugar', 'brown sugar', 'honey', 'maple syrup', 'molasses', 'corn syrup',
    'baking powder', 'baking soda', 'yeast', 'cornstarch', 'chocolate', 'cocoa powder',
    'vanilla extract', 'almond extract', 'quinoa flour', 'almond flour', 'coconut flour',
    'whole wheat flour', 'bread flour', 'cake flour', 'pastry flour', 'semolina flour',
    'rye flour'
  ],
  'Processed and Prepared': [
    'bread crumbs', 'tortilla', 'naan', 'pita', 'baguette', 'pancetta', 'prosciutto',
    'salami', 'pepperoni', 'chorizo', 'sausage', 'hot dog', 'anchovy', 'sardine',
    'caviar', 'roe', 'capers', 'olives', 'pickles', 'seaweed', 'miso', 'kimchi'
  ]
}.freeze

puts "Creating ingredients with categories..."
ingredients_with_categories.each do |category, ingredients|
  ingredients.each do |ingredient_name|
    Ingredient.find_or_create_by!(
      name: ingredient_name.downcase,
      category: category.to_s
    )
  end
end

# Load and parse JSON file
recipes_json = File.read(Rails.root.join('db', 'recipes-en.json'))
recipes_data = JSON.parse(recipes_json, symbolize_names: true).map do |recipe|
  {
    title: recipe[:title],
    description: recipe[:description],
    image_url: recipe[:image],
    cook_time: recipe[:cook_time],
    prep_time: recipe[:prep_time],
    ratings: recipe[:ratings],
    cuisine: recipe[:cuisine],
    category: recipe[:category],
    author: recipe[:author],
    ingredient_entries: recipe[:ingredients],
  }
end

puts "Creating recipes"
recipes_data.each do |recipe_data|
  recipe = Recipe.create!(recipe_data)
  #recipe_data[:ingredient_entries].each do |ingredient_entry|
  #  ingredient = Ingredient.find_by(name: ingredient_entry[:name])
  #  recipe.ingredients << ingredient
  #end
end

puts "Seed completed successfully!"