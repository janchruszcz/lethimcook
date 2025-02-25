class AddUserToRecipes < ActiveRecord::Migration[8.0]
  def change
    add_reference :recipes, :user, null: false, foreign_key: true

    add
  end
end
