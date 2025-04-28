require "test_helper"
require 'minitest/mock'

class Api::V1::AiChefControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = users(:john)
    login_as(@user)
  end

  test "should start recipe generation" do
    assert_difference('Recipe.count') do
      post api_v1_ai_chef_generate_recipe_url, params: { ingredients: ["tomato", "pasta"] }, as: :json
    end
    
    assert_response :created 

    response_body = JSON.parse(response.body)
    assert response_body["success"] 
    assert_not_nil response_body["data"]["id"]

    created_recipe = Recipe.find(response_body["data"]["id"])
    assert_equal 'pending', created_recipe.status
    assert_equal @user, created_recipe.user
    assert_equal 'New AI Recipe (Pending)', created_recipe.title
  end
  
  test "should get recipe status using mock" do
    expected_recipe_id = 'mock-recipe-123'

    mock_recipe_data = { 
      id: expected_recipe_id, 
      title: 'Mocked Recipe Title', 
      status: 'completed',
      description: nil, 
      instructions: [],
      ingredient_entries: [],
    }
    
    mock_recipe = Minitest::Mock.new
    mock_recipe.expect(:id, expected_recipe_id)
    mock_recipe.expect(:title, 'Mocked Recipe Title')
    mock_recipe.expect(:status, 'completed')
    mock_recipe.expect(:user_id, @user.id)
    mock_recipe.expect(:description, nil)
    mock_recipe.expect(:instructions, [])
    mock_recipe.expect(:ingredient_entries, [])
    mock_recipe.expect(:image_url, nil)
    mock_recipe.expect(:main_image, 'https://example.com/image.jpg')
    mock_recipe.expect(:prep_time, nil)
    mock_recipe.expect(:cook_time, nil)
    mock_recipe.expect(:cuisine, nil)
    mock_recipe.expect(:category, nil)
    mock_recipe.expect(:ratings, nil)
    mock_recipe.expect(:author, nil)
    mock_recipe.expect(:favorites, [])


    Recipe.stub :find, mock_recipe, [expected_recipe_id] do
      get api_v1_ai_chef_recipe_status_url(recipe_id: expected_recipe_id), as: :json 
    end 

    assert_response :success
    response_body = JSON.parse(response.body)
    
    assert response_body["success"]
    assert_not_nil response_body["data"]
    assert_equal expected_recipe_id, response_body["data"]["id"]
    assert_equal 'Mocked Recipe Title', response_body["data"]["title"]
    assert_equal 'completed', response_body["data"]["status"]

    mock_recipe.verify
  end

  test "should return not found for invalid recipe id" do
    invalid_recipe_id = 'invalid-id-404'

    get api_v1_ai_chef_recipe_status_url(recipe_id: invalid_recipe_id), as: :json

    assert_response :not_found 

    response_body = JSON.parse(response.body)
    assert_not response_body["success"]
    assert_kind_of Array, response_body["errors"]
    assert_equal "404", response_body["errors"][0]["status"]
    assert_equal "record_not_found", response_body["errors"][0]["code"]
    assert_match /Couldn't find Recipe/, response_body["errors"][0]["detail"]
  end
end
