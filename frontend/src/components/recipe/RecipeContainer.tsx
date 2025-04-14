import { useRecipeStore } from "../../stores/useRecipeStore";
import { RecipeGrid } from "./RecipeGrid";

export function RecipeContainer() {
    const { recipes, pagination, isLoading, filters, updatePage, deleteRecipe } = useRecipeStore();
  
    return (
      <div className="mt-8">
        <RecipeGrid
          recipes={recipes}
          pagination={pagination}
          isLoading={isLoading}
          selectedIngredientsCount={filters.ingredients?.length || 0}
          onPageChange={updatePage}
          onDeleteRecipe={deleteRecipe}
        />
      </div>
    );
  }