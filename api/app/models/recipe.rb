class Recipe < ApplicationRecord
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients
  
  validates :title, presence: true
  # validates :instructions, presence: true
  # validates :cook_time, numericality: { greater_than: 0 }, allow_nil: true
  # validates :prep_time, numericality: { greater_than: 0 }, allow_nil: true
  validates :ratings, numericality: { greater_than: 0, less_than_or_equal_to: 5 }, allow_nil: true

  def total_time
    (prep_time || 0) + (cook_time || 0)
  end
end
