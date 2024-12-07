class CreateRecipes < ActiveRecord::Migration[8.0]
  def change
    create_table :recipes do |t|
      t.string :title, null: false
      t.text :description
      t.text :ingredient_entries, array: true, default: []
      t.string :image_url
      t.integer :prep_time
      t.integer :cook_time
      t.float :ratings
      t.string :cuisine
      t.string :category
      t.string :author
      t.timestamps
    end
    
    add_index :recipes, :title
    add_index :recipes, :ingredient_entries, using: 'gin'
    add_index :recipes, :category
    add_index :recipes, :cuisine
  end
end
