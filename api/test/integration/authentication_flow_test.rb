require "test_helper"

class AuthenticationFlowTest < ActionDispatch::IntegrationTest
  test "full authentication flow" do
    # Step 1: Register a new user
    post "/signup", params: {
      user: {
        email: "integrationtest@example.com",
        password: "securepassword",
        password_confirmation: "securepassword"
      }
    }
    assert_response :success
    
    registration_response = JSON.parse(response.body)
    assert_equal "integrationtest@example.com", registration_response["email"]
    
    # Step 2: Sign in with the newly created user
    post "/login", params: {
      user: {
        email: "integrationtest@example.com",
        password: "securepassword"
      }
    }
    assert_response :success
        
    # Step 3: Sign out
    delete "/logout"
    assert_response :success
    
    # Step 4: Try to access protected resource (should fail)
    get "/auth/me"
    assert_response :unauthorized
    
    # Step 5: Sign in again with the same user
    post "/login", params: {
      user: {
        email: "integrationtest@example.com",
        password: "securepassword"
      }
    }
    assert_response :success
    
    # Step 6: Access protected resource
    get "/auth/me"
    assert_response :success
    
    user_info = JSON.parse(response.body)
    assert_equal "integrationtest@example.com", user_info["email"]
    
    # Step 7: Create a recipe (protected resource)
    post "/api/v1/recipes", params: {
      recipe: {
        title: "Integration Test Recipe",
        description: "A recipe created in an integration test",
        instructions: "Test instructions",
        prep_time: 10,
        cook_time: 20
      }
    }
    assert_response :success
    
    recipe_response = JSON.parse(response.body)
    assert recipe_response["data"]["id"].present?
    
    # Step 8: Verify the recipe was created
    get "/api/v1/recipes/#{recipe_response["data"]["id"]}"
    assert_response :success
    
    get_recipe_response = JSON.parse(response.body)
    assert_equal "Integration Test Recipe", get_recipe_response["data"]["title"]
  end
end
