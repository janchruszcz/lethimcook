require "test_helper"

class RecipeGeneratorTest < ActiveSupport::TestCase
  setup do
    @recipe = recipes(:one)
    @ingredients = ["tomato", "pasta"]
    @generator = RecipeGenerator.new(@ingredients, @recipe.id)
  end

  test "generates recipe successfully" do
    # Mock the Anthropic client response
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

    Anthropic::Client.any_instance.stubs(:messages).returns(mock_response)

    result = @generator.generate
    assert_equal "Pasta Pomodoro", result.title
    assert_equal 1, result.status # assuming 1 is the success status
  end

  test "handles invalid recipe format" do
    Anthropic::Client.any_instance.stubs(:messages).returns({"content" => [{"text" => "invalid json"}]})

    assert_raises(RuntimeError) do
      @generator.generate
    end

    @recipe.reload
    assert_equal 2, @recipe.status # assuming 2 is the error status
    assert_not_nil @recipe.error_message
  end
end
