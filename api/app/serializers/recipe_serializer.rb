class RecipeSerializer < Panko::Serializer
  attributes :id, :title, :description, :instructions, :image_url, 
             :prep_time, :cook_time, :ratings, 
             :cuisine, :category, :author, :total_time

  has_many :ingredients, serializer: IngredientSerializer

  def description
    ""
  end

  def instructions
    object.instructions.presence || {}
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
end