import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRecipeStore } from '../stores/useRecipeStore';
import { getRecipes } from '../api/recipes';

export function useRecipeData() {
  const {
    filters,
    setRecipes,
    setPagination,
    setLoading
  } = useRecipeStore();

  const { data, isLoading } = useQuery(
    ['recipes', filters],
    async () => {
      setLoading(true);
      
      const params = {
        ingredients: filters.ingredients?.join(','),
        page: filters.page,
        exact: filters.exactMatch,
        showFavorites: filters.showFavorites,
        showMyRecipes: filters.showMyRecipes
      };
      
      return getRecipes(params);
    },
    {
      onSuccess: (data) => {
        setRecipes(data.recipes || []);
        setPagination(data.pagination || {});
        setLoading(false);
      },
      onError: () => {
        setRecipes([]);
        setPagination(null);
        setLoading(false);
      }
    }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return { isLoading };
}
