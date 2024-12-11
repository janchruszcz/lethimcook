class Recipe < ApplicationRecord
  include PgSearch::Model

  # belongs_to :user
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients
  has_many :favorites
  has_many :favorited_by, through: :favorites, source: :user

  pg_search_scope :search_by_ingredients, 
    associated_against: {
      ingredients: :name
    },
    using: {
      tsearch: { prefix: true }
    }

  pg_search_scope :search_by_ingredient_entries, 
    against: :ingredient_entries,
    using: {
      tsearch: { prefix: true }
    }

 # Finds recipes containing at least these ingredients
 scope :with_ingredients, -> (ingredients) {
   where(
     ingredients.map { |ingredient|
       "EXISTS (SELECT 1 FROM unnest(ingredient_entries) entry WHERE entry ILIKE ?)"
     }.join(' AND '),
     *ingredients.map { |i| "%#{i}%" }
   )
 }

 # Finds recipes containing exactly these ingredients - no more, no less
 scope :with_exact_ingredients, -> (ingredients) {
   with_ingredients(ingredients)
     .where("array_length(ingredient_entries, 1) = ?", ingredients.length)
 }

  def total_time
    (prep_time || 0) + (cook_time || 0)
  end
end
