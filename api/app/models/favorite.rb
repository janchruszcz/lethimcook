class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :recipe, touch: true
end
