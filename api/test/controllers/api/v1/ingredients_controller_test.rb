require "test_helper"

class Api::V1::IngredientsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:john)
    sign_in @user
    
    @garlic = ingredients(:garlic)
    @tomato = ingredients(:tomato)
    @pasta = ingredients(:pasta)
  end

  test "should get index" do
    get api_v1_ingredients_url
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_kind_of Array, response_body
    assert_not_empty response_body
    
    ingredient = response_body.first
    assert ingredient["id"].present?
    assert ingredient["name"].present?
    assert ingredient["category"].present?
  end

  test "should search ingredients" do
    get search_api_v1_ingredients_url, params: { q: "tom" }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_kind_of Array, response_body
    
    # Should find tomato
    assert_includes response_body.map { |i| i["name"] }, "tomatoes"
    # Shouldn't find garlic
    refute_includes response_body.map { |i| i["name"] }, "garlic"
  end

  test "search should be case insensitive" do
    get search_api_v1_ingredients_url, params: { q: "TOMATO" }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_includes response_body.map { |i| i["name"] }, "tomatoes"
  end

  test "search with empty query should return empty array" do
    get search_api_v1_ingredients_url, params: { q: "" }
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_kind_of Array, response_body
    assert_empty response_body
  end

  test "search with nil query should return empty array" do
    get search_api_v1_ingredients_url
    assert_response :success
    
    response_body = JSON.parse(response.body)
    assert_kind_of Array, response_body
    assert_empty response_body
  end
end