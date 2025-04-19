require "test_helper"
require 'minitest/mock' # Require Minitest's mock library

class Api::V1::AiChefControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = users(:john)
    login_as(@user)
  end

  test "should start recipe generation" do
    assert_difference('Recipe.count') do
      post api_v1_ai_chef_generate_recipe_url, params: { ingredients: ["tomato", "pasta"] }, as: :json
    end
    
    assert_response :success

    response_body = JSON.parse(response.body)
    assert_equal "success", response_body["status"]
    assert_equal "Recipe generation started", response_body["message"]
    assert_not_nil response_body["recipeId"]

    # Optional: Check the created recipe's initial state
    created_recipe = Recipe.find(response_body["recipeId"])
    assert_equal 'pending', created_recipe.status
    assert_equal @user, created_recipe.user
  end
  
  test "should get recipe status using mock" do
    expected_recipe_id = 'mock-recipe-123'

    mock_recipe = Minitest::Mock.new
    mock_recipe.expect(:as_json, { 
      id: expected_recipe_id, 
      title: 'Mocked Recipe Title', 
      status: 'completed',
    }, [])


    Recipe.stub :find_by, mock_recipe, [{ id: expected_recipe_id }] do
      get api_v1_ai_chef_recipe_status_url(recipe_id: expected_recipe_id), as: :json 
    end 

    assert_response :success
    response_body = JSON.parse(response.body)
    
    assert_not_nil response_body["recipe"]
    assert_equal expected_recipe_id, response_body["recipe"]["id"]
    assert_equal 'Mocked Recipe Title', response_body["recipe"]["title"]
    assert_equal 'completed', response_body["recipe"]["status"]

    mock_recipe.verify
  end

  test "should return not found for invalid recipe id using mock" do
    invalid_recipe_id = 'invalid-id-404'

    Recipe.stub :find_by, nil, [{ id: invalid_recipe_id }] do
        get api_v1_ai_chef_recipe_status_url(recipe_id: invalid_recipe_id), as: :json
    end 

    assert_response :not_found 

    response_body = JSON.parse(response.body)
    assert_equal "failed", response_body["status"]
    assert_equal "Recipe not found", response_body["error"]
    assert_nil response_body["recipe"] 
  end
end
