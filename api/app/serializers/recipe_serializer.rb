class RecipeSerializer < Panko::Serializer
  attributes :id, :title, :description, :ingredient_entries, :instructions, :image_url, 
             :prep_time, :cook_time, :total_time, :ratings, :ingredients,
             :cuisine, :category, :author, :is_favorite

  #has_many :ingredients, serializer: IngredientSerializer

  def ingredients
    []
  end

  def ingredient_entries
    object.ingredient_entries.presence || []
  end

  def instructions
    ['Cook', 'Eat', 'Refactor']
  end

  def description
    ""
  end

  def prep_time
    object.prep_time || 0
  end

  def cook_time
    object.cook_time || 0
  end

  def total_time
    object.total_time || 0
  end

  def cuisine
    object.cuisine.presence || ""
  end

  def is_favorite
    return false unless context[:current_user]
    object.favorites.any? { |favorite| favorite.user_id == context[:current_user].id }
  end
end
