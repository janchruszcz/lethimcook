require "test_helper"

class RecipeFlowTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
  end

  test "recipe creation and interaction flow" do    
    # Step 1: Create a new recipe
    login_as(@user, scope: :user)
    
    post "/api/v1/recipes", params: {
      recipe: {
        title: "Flow Test Recipe",
        description: "A recipe created in a flow test",
        instructions: ["Step 1: Test", "Step 2: More test"],
        ingredient_entries: ["Flow Test Ingredient"],
        prep_time: 15,
        cook_time: 25,
      }
    }
    # Check for 201 Created specifically
    assert_response :created 
    
    recipe_response = JSON.parse(response.body)
    assert recipe_response["success"]
    recipe_id = recipe_response["data"]["id"] 

    logout(:user)
    
    # Step 2: Get recipe details
    get "/api/v1/recipes/#{recipe_id}"
    assert_response :success
    
    recipe_detail_response = JSON.parse(response.body)
    assert recipe_detail_response["success"]
    
    assert_equal "Flow Test Recipe", recipe_detail_response["data"]["title"] 
    assert_equal 1, recipe_detail_response["data"]["ingredient_entries"].length
    
    # Step 3: Search for recipes by ingredient
    get "/api/v1/recipes", params: { ingredients: "Flow Test Ingredient" }
    assert_response :success
    
    search_response = JSON.parse(response.body)
    assert search_response["success"]
    assert search_response["recipes"].any? { |r| r["id"] == recipe_id }
    
    # Step 4: Favorite the recipe
    login_as(@user, scope: :user)
    
    post "/api/v1/favorites", params: { id: recipe_id }
    assert_response :success
    
    logout(:user)
    
    # Step 5: Verify recipe is in favorites
    login_as(@user, scope: :user)
    get "/api/v1/recipes?favorites=true"
    assert_response :success
    
    favorites_response = JSON.parse(response.body)
    assert favorites_response["success"]
    assert favorites_response["recipes"].any? { |f| f["id"] == recipe_id }
    
    logout(:user)
    
    # Step 6: Unfavorite the recipe
    login_as(@user, scope: :user)
    
    delete "/api/v1/favorites/#{recipe_id}"
    assert_response :success
    
    logout(:user)
    
    # Step 7: Verify recipe is no longer in favorites
    login_as(@user, scope: :user)
    
    get "/api/v1/recipes?favorites=true"
    assert_response :success
    
    favorites_response = JSON.parse(response.body)
    assert favorites_response["success"]
    refute favorites_response["recipes"].any? { |f| f["id"] == recipe_id }
    
    logout(:user)
    
    # Step 8: Delete the recipe
    login_as(@user, scope: :user)
    
    delete "/api/v1/recipes/#{recipe_id}"
    assert_response :ok
    
    # Optional: Check response body for success: true and data
    # delete_response = JSON.parse(response.body)
    # assert delete_response["success"]
    # assert_equal recipe_id, delete_response["data"]["id"]

    logout(:user)
    
    # Step 9: Verify recipe no longer exists
    get "/api/v1/recipes/#{recipe_id}"
    assert_response :not_found
    
    # Optional: Check the standard error format
    # not_found_response = JSON.parse(response.body)
    # assert_not not_found_response["success"]
    # assert_equal "404", not_found_response["errors"][0]["status"]
    # assert_equal "record_not_found", not_found_response["errors"][0]["code"]
  end
end 