require "test_helper"

class AuthControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
  end

  test "should return user when authenticated" do
    login_as(@user)
    
    get "/auth/me"
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_equal @user.id, response_body["id"]
    assert_equal @user.email, response_body["email"]
  end

  test "should return unauthorized when not authenticated" do
    logout(@user)
    get "/auth/me"
    assert_response :unauthorized
    
    response_body = JSON.parse(response.body)
    assert_equal "Not authenticated", response_body["error"]
  end
end 