class AddStatusToRecipes < ActiveRecord::Migration[8.0]
  def change
    add_column :recipes, :status, :integer
  end
end
