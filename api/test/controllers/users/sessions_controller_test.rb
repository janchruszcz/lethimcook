require "test_helper"

class Users::SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
  end

  test "should sign in user with valid credentials" do
    post "/login", params: {
      user: {
        email: @user.email,
        password: "password123"
      }
    }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_equal @user.email, response_body["data"]["email"]
  end

  test "should sign out user" do
    # First sign in the user
    post "/login", params: {
      user: {
        email: @user.email,
        password: "password123"
      }
    }
    assert_response :success
    
    # Then try to sign out
    delete "/logout"
    assert_response :success
    
    get "/auth/me"
    assert_response :unauthorized
  end

  test "should not sign in user with invalid credentials" do
    post "/login", params: {
      user: {
        email: @user.email,
        password: "wrongpassword"
      }
    }
    assert_response :unauthorized
  end

  test "should not sign in non-existent user" do
    post "/login", params: {
      user: {
        email: "nonexistent@example.com",
        password: "password123"
      }
    }
    assert_response :unauthorized
  end
end 