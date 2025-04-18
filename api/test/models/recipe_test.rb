require "test_helper"

class RecipeTest < ActiveSupport::TestCase
  setup do
    @user = users(:john)
    @recipe = recipes(:spaghetti_carbonara)
  end

  test "valid recipe" do
    assert @recipe.valid?
  end

  test "recipe should have a title" do
    @recipe.title = nil
    assert_not @recipe.valid?
  end

  test "recipe should have a user" do
    @recipe.user = nil
    assert_not @recipe.valid?
  end

  test "total_time calculates correctly" do
    @recipe.prep_time = 15
    @recipe.cook_time = 20
    assert_equal 35, @recipe.total_time
  end

  test "total_time handles nil values" do
    @recipe.prep_time = nil
    @recipe.cook_time = 20
    assert_equal 20, @recipe.total_time

    @recipe.prep_time = 15
    @recipe.cook_time = nil
    assert_equal 15, @recipe.total_time

    @recipe.prep_time = nil
    @recipe.cook_time = nil
    assert_equal 0, @recipe.total_time
  end

  test "search_by_ingredient_entries returns matching recipes" do
    result = Recipe.search_by_ingredient_entries(["eggs", "pasta"])
    assert_includes result, @recipe
  end

  test "with_exact_ingredients scope filters correctly" do
    # This test assumes we know the exact ingredients in the fixture
    # You may need to adjust based on your actual fixture data
    ingredients = @recipe.ingredient_entries
    result = Recipe.with_exact_ingredients(ingredients)
    assert_includes result, @recipe
  end

  test "destroying recipe destroys associated recipe_ingredients" do
    recipe_ingredient_count = @recipe.recipe_ingredients.count
    assert_difference "RecipeIngredient.count", -recipe_ingredient_count do
      @recipe.destroy
    end
  end

  test "recipe can be favorited" do
    assert_difference "Favorite.count" do
      @recipe.favorites.create(user: users(:jane))
    end
    assert_includes @recipe.favorited_by, users(:jane)
  end
end 