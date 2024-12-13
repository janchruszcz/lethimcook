require "test_helper"

class Api::V1::FavoritesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
    @recipe = recipes(:spaghetti_carbonara)
    sign_in @user
  end

  test "should get index of favorite recipes" do
    # Create a favorite for testing
    Favorite.create!(user: @user, recipe: @recipe)

    get api_v1_favorites_url
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert response_body["success"]
    assert_kind_of Array, response_body["recipes"]
    assert_not_empty response_body["recipes"]
    
    assert response_body["pagination"].present?
    assert response_body["pagination"]["page"].present?
    assert response_body["pagination"]["pages"].present?
    assert response_body["pagination"]["count"].present?
    assert response_body["pagination"]["items"].present?
  end

  test "should create favorite" do
    assert_difference("Favorite.count") do
      post api_v1_favorites_url, params: { recipe_id: @recipe.id }
    end

    assert_response :success
    response_body = JSON.parse(response.body)
    assert response_body["success"]
    assert response_body["favorited"]
  end

  test "should not create duplicate favorite" do
    # Create initial favorite
    Favorite.create!(user: @user, recipe: @recipe)

    assert_no_difference("Favorite.count") do
      post api_v1_favorites_url, params: { recipe_id: @recipe.id }
    end

    assert_response :unprocessable_entity
  end

  test "should destroy favorite" do
    favorite = Favorite.create!(user: @user, recipe: @recipe)

    assert_difference("Favorite.count", -1) do
      delete api_v1_favorite_url(@recipe)
    end

    assert_response :success
    response_body = JSON.parse(response.body)
    assert response_body["success"]
    refute response_body["favorited"]
  end

  test "should handle destroying non-existent favorite" do
    delete api_v1_favorite_url(@recipe)
    assert_response :not_found
  end

  test "should require authentication for all actions" do
    sign_out @user

    # Test index
    get api_v1_favorites_url
    assert_response :unauthorized

    # Test create
    post api_v1_favorites_url, params: { recipe_id: @recipe.id }
    assert_response :unauthorized

    # Test destroy
    delete api_v1_favorite_url(@recipe)
    assert_response :unauthorized
  end

  test "should not allow access to other users' favorites" do
    other_user = users(:jane)
    other_recipe = recipes(:tomato_soup)
    other_favorite = Favorite.create!(user: other_user, recipe: other_recipe)

    # Try to delete another user's favorite
    delete api_v1_favorite_url(other_recipe)
    assert_response :not_found
  end

  test "index should return empty array when user has no favorites" do
    # Ensure user has no favorites
    @user.favorites.destroy_all

    get api_v1_favorites_url
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert response_body["success"]
    assert_empty response_body["recipes"]
    assert_equal 0, response_body["pagination"]["count"]
  end
end