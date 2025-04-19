require "test_helper"

class Api::V1::RecipesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @recipe = recipes(:spaghetti_carbonara)
    @user = users(:john)
    login_as(@user, scope: :user)
  end

  test "should get index" do
    get api_v1_recipes_url
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert response_body["success"]
    assert_kind_of Array, response_body["recipes"]
    assert response_body["pagination"].present?
  end

  test "should filter recipes by ingredients" do
    get api_v1_recipes_url, params: { ingredients: "tomato,garlic" }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert response_body["success"]
  end

  test "should filter recipes by exact ingredients" do
    get api_v1_recipes_url, params: { ingredients: "tomato,garlic", exact: "true" }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert response_body["success"]
  end

  test "should get show" do
    get api_v1_recipe_url(@recipe)
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert response_body["success"]
    assert response_body["recipe"].present?
  end

  test "should return 404 for non-existent recipe" do
    get api_v1_recipe_url(id: 'non-existent')
    assert_response :not_found
  end

  test "pagination should work" do
    get api_v1_recipes_url, params: { page: 1 }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_equal 1, response_body["pagination"]["page"]
  end

  test "should update recipe" do
    patch api_v1_recipe_url(@recipe), params: { recipe: { title: "Updated Title", ingredient_entries: ["tomato", "garlic"] } }, as: :json
    assert_response :success

    response_body = JSON.parse(response.body)
    assert response_body["success"]
    assert_equal "Updated Title", response_body["recipe"]["title"]
    assert_equal ["tomato", "garlic"], response_body["recipe"]["ingredient_entries"]
    @recipe.reload
    assert_equal "Updated Title", @recipe.title
    assert_equal ["tomato", "garlic"], @recipe.ingredient_entries
  end

  test "should not update recipe with invalid data" do
    patch api_v1_recipe_url(@recipe), params: { recipe: { title: "" } }, as: :json # Assuming title cannot be blank
    assert_response :unprocessable_entity

    response_body = JSON.parse(response.body)
    assert_not response_body["success"]
    assert response_body["errors"].present?
  end

  test "should return 404 when trying to update non-existent recipe" do
    patch api_v1_recipe_url(id: 'non-existent'), params: { recipe: { title: "Updated Title" } }, as: :json
    assert_response :not_found
  end

  test "should destroy recipe" do
    assert_difference('Recipe.count', -1) do
      delete api_v1_recipe_url(@recipe)
    end
    assert_response :success
  end

  test "should return 404 when trying to destroy non-existent recipe" do
    delete api_v1_recipe_url(id: 'non-existent')
    assert_response :not_found
  end

  test "should create recipe" do
    assert_difference('Recipe.count') do
      post api_v1_recipes_url, params: { 
        recipe: { 
          title: "New Test Recipe", 
          description: "Test description", 
          ingredient_entries: ["ingredient1", "ingredient2"],
          instructions: ["step1", "step2"],
          prep_time: 10,
          cook_time: 20,
          cuisine: "Test Cuisine",
          category: "Test Category",
          author: "Test Author"
        } 
      }, as: :json
    end

    assert_response :success

    response_body = JSON.parse(response.body)
    assert response_body["success"]
    assert response_body["recipe"].present?
    assert_equal "New Test Recipe", response_body["recipe"]["title"]
    assert_equal ["ingredient1", "ingredient2"], response_body["recipe"]["ingredient_entries"]
    
    # Verify ownership
    created_recipe = Recipe.find(response_body["recipe"]["id"])
    assert_equal @user.id, created_recipe.user_id
  end

  test "should not create recipe with invalid data" do
    assert_no_difference('Recipe.count') do
      post api_v1_recipes_url, params: { 
        recipe: { 
          title: "" # Invalid title
        } 
      }, as: :json
    end

    assert_response :unprocessable_entity

    response_body = JSON.parse(response.body)
    assert_not response_body["success"]
    assert response_body["errors"].present?
    assert response_body["errors"]["title"].present? # Check for specific error
  end
end