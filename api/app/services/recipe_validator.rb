class RecipeValidator
  def initialize(recipe)
    @recipe = recipe
  end

  def validate_recipe
    client = Anthropic::Client.new

    response = client.messages(
      parameters: {
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0.5,
        messages: [
          {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "You are a cooking recipe validator. Your task is to analyze a recipe provided in JSON format and check if the ingredients are correct and in the right proportions, if the instructions make sense, and if the overall recipe is coherent and feasible. Here's how to proceed:\n\n1. First, you will be given a recipe in JSON format. Parse this JSON to extract the relevant information:\n\n<recipe_json>\n{{RECIPE_JSON}}\n</recipe_json>\n\n2. Extract the title, ingredients, and instructions from the JSON. If any of these key elements are missing, note it as an error.\n\n3. Analyze the ingredients list:\n   - Check if all necessary ingredients for the dish are included\n   - Verify if the quantities seem appropriate for the number of servings (if provided)\n   - Look for any unusual or potentially incorrect ingredients\n\n4. Analyze the instructions:\n   - Ensure all ingredients mentioned in the instructions are listed in the ingredients section\n   - Check if the order of steps makes logical sense\n   - Verify if cooking times and temperatures (if mentioned) are appropriate\n   - Look for any missing crucial steps\n\n5. Assess the overall coherence of the recipe:\n   - Does the title match the ingredients and instructions?\n   - Are there any inconsistencies between the ingredients list and the instructions?\n   - Does the recipe seem complete and feasible?\n\n6. Based on your analysis, provide feedback and suggestions:\n   - Point out any errors or inconsistencies\n   - Suggest improvements or additions if necessary\n   - Highlight any particularly good aspects of the recipe\n\n7. Summarize your findings in the following format:\n\n<validation_result>\n<overall_assessment>\n[Provide a brief overall assessment of the recipe's validity]\n</overall_assessment>\n\n<ingredient_feedback>\n[List any issues or suggestions related to ingredients]\n</ingredient_feedback>\n\n<instruction_feedback>\n[List any issues or suggestions related to instructions]\n</instruction_feedback>\n\n<coherence_feedback>\n[Provide feedback on the overall coherence and feasibility of the recipe]\n</coherence_feedback>\n\n<suggestions>\n[Offer any additional suggestions for improving the recipe]\n</suggestions>\n</validation_result>\n\nRemember to be thorough in your analysis but also consider that cooking allows for some flexibility and creativity. Focus on identifying clear errors, inconsistencies, or areas for improvement rather than minor stylistic choices."
                }
            ]
          }
        ]
      }
    ) 
  end
end