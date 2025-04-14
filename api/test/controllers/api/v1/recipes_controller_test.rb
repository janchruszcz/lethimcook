require "test_helper"

class Api::V1::RecipesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @recipe = recipes(:spaghetti_carbonara)
    @user = users(:john)
    sign_in @user
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
    get api_v1_recipes_url, params: { page: 1, items: 5 }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    puts response_body.inspect
    assert_equal 1, response_body["pagination"]["page"]
    assert_equal 5, response_body["pagination"]["items"]
  end

  test "should update recipe" do
    patch api_v1_recipe_url(@recipe), params: { recipe: { title: "Updated Title", instructions: "New instructions." } }, as: :json
    assert_response :success

    response_body = JSON.parse(response.body)
    assert response_body["success"]
    assert_equal "Updated Title", response_body["recipe"]["title"]

    @recipe.reload
    assert_equal "Updated Title", @recipe.title
    assert_equal "New instructions.", @recipe.instructions
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
    assert_response :success # Or :no_content depending on your controller's response

    response_body = JSON.parse(response.body) # Only if response is not :no_content
    assert response_body["success"] # Only if response is not :no_content
  end

  test "should return 404 when trying to destroy non-existent recipe" do
    delete api_v1_recipe_url(id: 'non-existent')
    assert_response :not_found
  end
end