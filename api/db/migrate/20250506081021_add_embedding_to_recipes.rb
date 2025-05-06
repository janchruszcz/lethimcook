class AddEmbeddingToRecipes < ActiveRecord::Migration[8.0]
  def up
    enable_extension 'vector'
    add_column :recipes, :embedding, :vector, dimension: 1536
    add_index :recipes, :embedding, using: :ivfflat, opclass: :vector_l2_ops
  end

  def down
    remove_index :recipes, :embedding
    remove_column :recipes, :embedding
  end
end
