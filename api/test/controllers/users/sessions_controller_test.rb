require "test_helper"

class Users::SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
    @user.update(password: "password123", password_confirmation: "password123")
  end

  test "should sign in user with valid credentials" do
    post "/users/sign_in", params: {
      user: {
        email: @user.email,
        password: "password123"
      }
    }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_equal @user.email, response_body["email"]
    assert_not_nil response_body["token"]
  end

  test "should not sign in user with invalid credentials" do
    post "/users/sign_in", params: {
      user: {
        email: @user.email,
        password: "wrongpassword"
      }
    }
    assert_response :unauthorized
  end

  test "should not sign in non-existent user" do
    post "/users/sign_in", params: {
      user: {
        email: "nonexistent@example.com",
        password: "password123"
      }
    }
    assert_response :unauthorized
  end

  test "should sign out user" do
    sign_in @user
    
    delete "/users/sign_out"
    assert_response :success
    
    # Verify the user is signed out by attempting to access a protected resource
    get "/auth/me"
    assert_response :unauthorized
  end
end 