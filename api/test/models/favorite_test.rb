require "test_helper"

class FavoriteTest < ActiveSupport::TestCase
  setup do
    @user = users(:john)
    @favorite = favorites(:john_carbonara)
  end

  test "valid favorite" do
    assert @favorite.valid?
  end

  test "favorite requires a user" do
    @favorite.user = nil
    assert_not @favorite.valid?
  end

  test "favorite requires a recipe" do
    @favorite.recipe = nil
    assert_not @favorite.valid?
  end

  test "can create a new favorite" do
    new_recipe = recipes(:chicken_curry)
    assert_difference "Favorite.count" do
      Favorite.create(user: @user, recipe: new_recipe)
    end
  end

  test "destroying user destroys favorite" do
    assert_difference "Favorite.count", -1 do
      @favorite.user.destroy
    end
  end

  test "destroying recipe destroys favorite" do
    assert_difference "Favorite.count", -1 do
      @favorite.recipe.destroy
    end
  end

  test "favorite should raise error on duplicate save" do
    duplicate = @favorite.dup
    assert_raises(ActiveRecord::RecordNotUnique) do
      duplicate.save!
    end
  end
end 