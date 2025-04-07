require "test_helper"

class RecipeIngredientTest < ActiveSupport::TestCase
  setup do
    @recipe = recipes(:spaghetti_carbonara)
    @ingredient = ingredients(:garlic)
    @recipe_ingredient = RecipeIngredient.where(recipe: @recipe, ingredient: @ingredient).first
  end

  test "valid recipe_ingredient" do
    assert @recipe_ingredient.valid?
  end

  test "recipe_ingredient requires a recipe" do
    @recipe_ingredient.recipe = nil
    assert_not @recipe_ingredient.valid?
  end

  test "recipe_ingredient requires an ingredient" do
    @recipe_ingredient.ingredient = nil
    assert_not @recipe_ingredient.valid?
  end

  test "recipe_ingredient should be unique per recipe and ingredient" do
    duplicate = @recipe_ingredient.dup
    assert_not duplicate.valid?
  end

  test "can create a new recipe_ingredient" do
    new_recipe = recipes(:chicken_curry)
    new_ingredient = ingredients(:tomato)
    
    assert_difference "RecipeIngredient.count" do
      RecipeIngredient.create(recipe: new_recipe, ingredient: new_ingredient)
    end
  end

  test "destroying recipe destroys recipe_ingredient" do
    assert_difference "RecipeIngredient.count", -1 do
      @recipe_ingredient.recipe.destroy
    end
  end

  test "destroying ingredient destroys recipe_ingredient" do
    assert_difference "RecipeIngredient.count", -1 do
      @recipe_ingredient.ingredient.destroy
    end
  end
end 