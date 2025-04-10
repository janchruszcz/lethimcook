import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRecipeStore } from '../stores/useRecipeStore';
import { searchRecipes, getUserRecipes } from '../api/recipes';
import { getFavoriteRecipes } from '../api/favorites';

export function useRecipeData() {
  const {
    filters,
    showFavorites,
    showMyRecipes,
    setRecipes,
    setPagination,
    setLoading
  } = useRecipeStore();

  const { data, isLoading } = useQuery(
    ['recipes', filters],
    () => searchRecipes(filters),
    {
      enabled: !showFavorites && !showMyRecipes && 
               filters.ingredients?.length > 1,
    }
  );

  const { data: favoriteData, isLoading: isFavoritesLoading } = useQuery(
    'favoriteRecipes',
    getFavoriteRecipes,
    { enabled: showFavorites }
  );

  const { data: myRecipesData, isLoading: isMyRecipesLoading } = useQuery(
    'userRecipes',
    getUserRecipes,
    { enabled: showMyRecipes }
  );

  useEffect(() => {
    if (showFavorites && favoriteData) {
      setRecipes(favoriteData.recipes);
      setPagination(favoriteData.pagination);
      setLoading(isFavoritesLoading);
    } else if (showMyRecipes && myRecipesData) {
      setRecipes(myRecipesData.recipes);
      setPagination(myRecipesData.pagination);
      setLoading(isMyRecipesLoading);
    } else if (data) {
      setRecipes(data.recipes);
      setPagination(data.pagination);
      setLoading(isLoading);
    }
  }, [data, favoriteData, myRecipesData, showFavorites, showMyRecipes]);
}
