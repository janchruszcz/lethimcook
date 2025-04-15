require "test_helper"

class AuthenticationFlowTest < ActionDispatch::IntegrationTest
  test "full authentication flow" do
    # Step 1: Register a new user
    post "/users", params: {
      user: {
        email: "integrationtest@example.com",
        password: "securepassword",
        password_confirmation: "securepassword"
      }
    }
    assert_response :success
    
    registration_response = JSON.parse(response.body)
    assert_not_nil registration_response["token"]
    assert_equal "integrationtest@example.com", registration_response["email"]
    
    # Step 2: Sign out
    delete "/users/sign_out"
    assert_response :success
    
    # Step 3: Try to access protected resource (should fail)
    get "/auth/me"
    assert_response :unauthorized
    
    # Step 4: Sign in with the newly created user
    post "/users/sign_in", params: {
      user: {
        email: "integrationtest@example.com",
        password: "securepassword"
      }
    }
    assert_response :success
    
    login_response = JSON.parse(response.body)
    assert_not_nil login_response["token"]
    
    # Save the token for authentication
    auth_token = login_response["token"]
    
    # Step 5: Access protected resource with token
    get "/auth/me", headers: { "Authorization" => "Bearer #{auth_token}" }
    assert_response :success
    
    user_info = JSON.parse(response.body)
    assert_equal "integrationtest@example.com", user_info["email"]
    
    # Step 6: Create a recipe (protected resource)
    post "/api/v1/recipes", params: {
      recipe: {
        title: "Integration Test Recipe",
        description: "A recipe created in an integration test",
        instructions: "Test instructions",
        prep_time: 10,
        cook_time: 20
      }
    }, headers: { "Authorization" => "Bearer #{auth_token}" }
    assert_response :success
    
    recipe_response = JSON.parse(response.body)
    assert recipe_response["recipe"]["id"].present?
    
    # Step 7: Verify the recipe was created
    get "/api/v1/recipes/#{recipe_response["recipe"]["id"]}", 
        headers: { "Authorization" => "Bearer #{auth_token}" }
    assert_response :success
    
    get_recipe_response = JSON.parse(response.body)
    assert_equal "Integration Test Recipe", get_recipe_response["recipe"]["title"]
  end
end
