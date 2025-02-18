require "test_helper"

class Api::V1::AiChefControllerTest < ActionDispatch::IntegrationTest
  test "should generate recipe" do
    post api_v1_ai_chef_generate_recipe_url, params: { ingredients: ["tomato", "pasta"] }
    assert_response :success

    response_body = JSON.parse(response.body)
    assert_equal "Recipe generation started", response_body["message"]
  end
  
  test "should get recipe status" do
    get api_v1_ai_chef_recipe_status_url, params: { recipe_id: "1" }
    assert_response :success

    response_body = JSON.parse(response.body)
    assert_equal "Recipe generation started", response_body["message"]
  end
end
