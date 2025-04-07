require "test_helper"

class UserTest < ActiveSupport::TestCase
  setup do
    @user = users(:john)
  end

  test "valid user" do
    assert @user.valid?
  end

  test "user requires email" do
    @user.email = nil
    assert_not @user.valid?
  end

  test "user requires password" do
    user = User.new(email: "test@example.com")
    assert_not user.valid?
  end

  test "email must be unique" do
    duplicate_user = @user.dup
    assert_not duplicate_user.valid?
  end

  test "password must be at least 6 characters" do
    user = User.new(email: "test@example.com", password: "12345", password_confirmation: "12345")
    assert_not user.valid?
  end

  test "user has many recipes" do
    assert_respond_to @user, :recipes
    assert_kind_of ActiveRecord::Associations::CollectionProxy, @user.recipes
  end

  test "user has many favorites" do
    assert_respond_to @user, :favorites
    assert_kind_of ActiveRecord::Associations::CollectionProxy, @user.favorites
  end

  test "user has many favorite_recipes" do
    assert_respond_to @user, :favorite_recipes
    assert_kind_of ActiveRecord::Associations::CollectionProxy, @user.favorite_recipes
  end

  test "destroying user destroys associated recipes" do
    user_with_recipes = users(:jane)
    recipe_count = user_with_recipes.recipes.count
    
    assert_difference "Recipe.count", -recipe_count do
      user_with_recipes.destroy
    end
  end

  test "destroying user destroys associated favorites" do
    # First create a favorite for our test user
    @user.favorites.create(recipe: recipes(:spaghetti_carbonara))
    
    assert_difference "Favorite.count", -1 do
      @user.destroy
    end
  end

  test "can favorite a recipe" do
    recipe = recipes(:spaghetti_carbonara)
    
    assert_difference "Favorite.count" do
      @user.favorites.create(recipe: recipe)
    end
    
    assert_includes @user.favorite_recipes, recipe
  end
end 