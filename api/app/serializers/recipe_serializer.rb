class RecipeSerializer < Panko::Serializer
  attributes :id, :title, :description, :ingredient_entries, :instructions, :status, 
             :prep_time, :cook_time, :total_time, :ratings, :ingredients,
             :cuisine, :category, :author, :is_favorite, :main_image

  #has_many :ingredients, serializer: IngredientSerializer

  def main_image
    if object.main_image.attached?
      Rails.application.routes.url_helpers.url_for(object.main_image)
    else
      "https://chilitonka.com/wp-content/uploads/2013/09/curry-ct2867.jpg"
    end
  end

  def image_url
    object.image_url.presence || "https://chilitonka.com/wp-content/uploads/2013/09/curry-ct2867.jpg"
  end

  def ingredients
    []
  end

  def ingredient_entries
    object.ingredient_entries.presence || []
  end

  def instructions
    object.instructions.presence || []
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
