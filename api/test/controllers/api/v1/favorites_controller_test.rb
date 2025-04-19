require "test_helper"

class Api::V1::FavoritesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
    @recipe = recipes(:spaghetti_carbonara)
    @other_recipe = recipes(:tomato_soup)
    login_as(@user, scope: :user)
  end

  test "should create favorite" do
    assert_difference("Favorite.count") do
      post api_v1_favorites_url, params: { id: @other_recipe.id }
    end

    assert_response :success
    response_body = JSON.parse(response.body)
    assert response_body["success"]
  end

  test "should not create duplicate favorite" do
    assert_raises(ActiveRecord::RecordNotUnique) do
      post api_v1_favorites_url, params: { id: @recipe.id }
    end
  end

  test "should destroy favorite" do
    assert Favorite.exists?(user: @user, recipe: @recipe)
    initial_count = Favorite.count

    delete api_v1_favorite_url(@recipe.id)

    assert_response :success
    response_body = JSON.parse(response.body)

    assert_equal initial_count - 1, Favorite.count
    refute Favorite.exists?(user: @user, recipe: @recipe)
  end

  test "should handle destroying non-existent favorite" do
    # Verify the favorite does not exist for this user/recipe combo
    refute Favorite.exists?(user: @user, recipe: @other_recipe)

    delete api_v1_favorite_url(@other_recipe)
    assert_response :not_found
  end

  test "should require authentication for all actions" do
    logout(:user)

    post api_v1_favorites_url, params: { id: @other_recipe.id }
    assert_response :redirect
    assert_redirected_to new_user_session_path

    delete api_v1_favorite_url(@recipe)
    assert_response :redirect
    assert_redirected_to new_user_session_path
  end

  test "should not allow access to other users' favorites" do
    login_as(@user, scope: :user)
    other_user = users(:jane)
    other_recipe = recipes(:chicken_curry)

    assert Favorite.exists?(user: other_user, recipe: other_recipe)

    delete api_v1_favorite_url(other_recipe)
    assert_response :not_found
  end
end