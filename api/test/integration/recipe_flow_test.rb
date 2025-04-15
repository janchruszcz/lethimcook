require "test_helper"

class RecipeFlowTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
    sign_in @user
  end

  test "recipe creation and interaction flow" do
    # Step 1: Create a new ingredient
    post "/api/v1/ingredients", params: {
      ingredient: {
        name: "Flow Test Ingredient"
      }
    }
    assert_response :success
    
    ingredient_response = JSON.parse(response.body)
    ingredient_id = ingredient_response["ingredient"]["id"]
    
    # Step 2: Create a new recipe
    post "/api/v1/recipes", params: {
      recipe: {
        title: "Flow Test Recipe",
        description: "A recipe created in a flow test",
        instructions: "Step 1: Test\nStep 2: More test",
        prep_time: 15,
        cook_time: 25,
        ingredient_ids: [ingredient_id]
      }
    }
    assert_response :success
    
    recipe_response = JSON.parse(response.body)
    recipe_id = recipe_response["recipe"]["id"]
    
    # Step 3: Get recipe details
    get "/api/v1/recipes/#{recipe_id}"
    assert_response :success
    
    recipe_detail = JSON.parse(response.body)
    assert_equal "Flow Test Recipe", recipe_detail["recipe"]["title"]
    assert_equal 1, recipe_detail["recipe"]["ingredients"].length
    
    # Step 4: Search for recipes by ingredient
    get "/api/v1/recipes", params: { ingredients: "Flow Test Ingredient" }
    assert_response :success
    
    search_response = JSON.parse(response.body)
    assert search_response["recipes"].any? { |r| r["id"] == recipe_id }
    
    # Step 5: Favorite the recipe
    post "/api/v1/favorites", params: { recipe_id: recipe_id }
    assert_response :success
    
    # Step 6: Verify recipe is in favorites
    get "/api/v1/favorites"
    assert_response :success
    
    favorites_response = JSON.parse(response.body)
    assert favorites_response["favorites"].any? { |f| f["recipe_id"] == recipe_id }
    
    # Step 7: Unfavorite the recipe
    delete "/api/v1/favorites/#{recipe_id}"
    assert_response :success
    
    # Step 8: Verify recipe is no longer in favorites
    get "/api/v1/favorites"
    assert_response :success
    
    favorites_response = JSON.parse(response.body)
    assert_not favorites_response["favorites"].any? { |f| f["recipe_id"] == recipe_id }
    
    # Step 9: Delete the recipe
    delete "/api/v1/recipes/#{recipe_id}"
    assert_response :success
    
    # Step 10: Verify recipe no longer exists
    get "/api/v1/recipes/#{recipe_id}"
    assert_response :not_found
  end
end 