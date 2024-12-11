class Ingredient < ApplicationRecord
  include PgSearch::Model

  has_many :recipe_ingredients, dependent: :destroy
  has_many :recipes, through: :recipe_ingredients

  pg_search_scope :search_by_name, 
    against: :name, 
    using: {
      tsearch: { prefix: true }
    }
end
