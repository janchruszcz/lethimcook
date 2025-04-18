require "test_helper"

class IngredientTest < ActiveSupport::TestCase
  setup do
    @ingredient = ingredients(:garlic)
  end

  test "valid ingredient" do
    assert @ingredient.valid?
  end

  test "ingredient has many recipe_ingredients" do
    assert_respond_to @ingredient, :recipe_ingredients
    assert_kind_of ActiveRecord::Associations::CollectionProxy, @ingredient.recipe_ingredients
  end

  test "ingredient has many recipes" do
    assert_respond_to @ingredient, :recipes
    assert_kind_of ActiveRecord::Associations::CollectionProxy, @ingredient.recipes
  end

  test "search_by_name returns matching ingredients" do
    result = Ingredient.search_by_name("garlic")
    assert_includes result, @ingredient
  end

  test "search_by_name with partial name returns matching ingredients" do
    result = Ingredient.search_by_name("gar")
    assert_includes result, @ingredient
  end

  test "search_by_name is case insensitive" do
    result = Ingredient.search_by_name("GARLIC")
    assert_includes result, @ingredient
  end

  test "destroying ingredient destroys associated recipe_ingredients" do
    recipe_ingredient_count = @ingredient.recipe_ingredients.count
    assert_difference "RecipeIngredient.count", -recipe_ingredient_count do
      @ingredient.destroy
    end
  end

  test "destroying ingredient does not destroy associated recipes" do
    recipes_count = Recipe.count
    @ingredient.destroy
    assert_equal recipes_count, Recipe.count
  end
end 