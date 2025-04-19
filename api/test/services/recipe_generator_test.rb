require "test_helper"
require 'mocha/minitest'

class RecipeGeneratorTest < ActiveSupport::TestCase
  setup do
    @user = users(:john)
    login_as(@user)
    @ingredients = ["tomato", "pasta"]
    @recipe = Recipe.create!(user: @user, title: "Initial Title", status: :pending)
    @generator = RecipeGenerator.new(@ingredients, @recipe.id)

    @mock_anthropic_client = mock('anthropic_client')
    Anthropic::Client.stubs(:new).returns(@mock_anthropic_client)
  end

  test "generates recipe successfully" do
    mock_response = {
      "content" => [{
        "text" => {
          title: "Pasta Pomodoro",
          description: "Classic Italian pasta dish",
          ingredient_entries: ["400g pasta", "4 tomatoes"],
          instructions: ["Cook pasta", "Make sauce"],
          cuisine: "Italian",
          category: "Main Course",
          prep_time: 15,
          cook_time: 20,
          author: "Jesse"
        }.to_json
      }]
    }

    @mock_anthropic_client.stubs(:messages).returns(mock_response)

    @generator.generate
    @recipe.reload
    assert_equal "Pasta Pomodoro", @recipe.title
    assert_equal "completed", @recipe.status
  end

  test "handles invalid recipe format" do
    @mock_anthropic_client.stubs(:messages).returns({"content" => [{"text" => "invalid json"}]})

    @generator.generate

    @recipe.reload
    assert_equal "failed", @recipe.status
  end
end
