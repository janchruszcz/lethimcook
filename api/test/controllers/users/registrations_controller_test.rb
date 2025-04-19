require "test_helper"

class Users::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "should register a new user with valid parameters" do
    assert_difference "User.count" do
      post "/signup", params: {
        user: {
          email: "newuser@example.com",
          password: "password123",
          password_confirmation: "password123"
        }
      }
    end
    
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_equal "newuser@example.com", response_body["email"]
  end

  test "should not register a user with invalid email" do
    assert_no_difference "User.count" do
      post "/signup", params: {
        user: {
          email: "invalid-email",
          password: "password123",
          password_confirmation: "password123"
        }
      }
    end
    
    assert_response :unprocessable_entity
  end

  test "should not register a user with mismatched passwords" do
    assert_no_difference "User.count" do
      post "/signup", params: {
        user: {
          email: "newuser@example.com",
          password: "password123",
          password_confirmation: "differentpassword"
        }
      }
    end
    
    assert_response :unprocessable_entity
  end

  test "should not register a user with short password" do
    assert_no_difference "User.count" do
      post "/signup", params: {
        user: {
          email: "newuser@example.com",
          password: "short",
          password_confirmation: "short"
        }
      }
    end
    
    assert_response :unprocessable_entity
  end

  test "should not register a user with duplicate email" do
    existing_user = users(:john)
    
    assert_no_difference "User.count" do
      post "/signup", params: {
        user: {
          email: existing_user.email,
          password: "password123",
          password_confirmation: "password123"
        }
      }
    end
    
    assert_response :unprocessable_entity
  end
end 