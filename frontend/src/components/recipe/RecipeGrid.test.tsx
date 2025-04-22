import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeGrid } from './RecipeGrid';

// Mock dependencies
jest.mock('./RecipeCard', () => ({
  RecipeCard: jest.fn(({ recipe }) => (
    <div data-testid={`recipe-card-${recipe.id}`}>
      {recipe.title}
    </div>
  ))
}));

jest.mock('../ui/EmptyState', () => ({
  EmptyState: jest.fn(({ selectedIngredientsCount }) => (
    <div data-testid="empty-state">
      No recipes found with {selectedIngredientsCount} ingredients
    </div>
  ))
}));

jest.mock('../ui/LoadingSpinner', () => ({
  LoadingSpinner: jest.fn(() => <div data-testid="loading-spinner">Loading...</div>)
}));

jest.mock('../ui/Pagination', () => ({
  Pagination: jest.fn(({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ))
}));

describe('RecipeGrid', () => {
  // Common test variables
  const mockOnPageChange = jest.fn();
  const mockOnDeleteRecipe = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('shows loading spinner when isLoading is true', () => {
    render(
      <RecipeGrid
        recipes={[]}
        isLoading={true}
        selectedIngredientsCount={0}
        onPageChange={mockOnPageChange}
        onDeleteRecipe={mockOnDeleteRecipe}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    expect(screen.queryByTestId(/recipe-card-/)).not.toBeInTheDocument();
  });

  test('shows empty state when recipes array is empty', () => {
    render(
      <RecipeGrid
        recipes={[]}
        isLoading={false}
        selectedIngredientsCount={2}
        onPageChange={mockOnPageChange}
        onDeleteRecipe={mockOnDeleteRecipe}
      />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId(/recipe-card-/)).not.toBeInTheDocument();
    expect(screen.getByText('No recipes found with 2 ingredients')).toBeInTheDocument();
  });

  test('renders recipe cards for each recipe', () => {
    const mockRecipes = [
      { id: 1, title: 'Recipe 1' },
      { id: 2, title: 'Recipe 2' },
      { id: 3, title: 'Recipe 3' }
    ];

    render(
      <RecipeGrid
        recipes={mockRecipes}
        isLoading={false}
        selectedIngredientsCount={0}
        onPageChange={mockOnPageChange}
        onDeleteRecipe={mockOnDeleteRecipe}
      />
    );

    expect(screen.getByTestId('recipe-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-card-3')).toBeInTheDocument();
    expect(screen.getByText('Recipe 1')).toBeInTheDocument();
    expect(screen.getByText('Recipe 2')).toBeInTheDocument();
    expect(screen.getByText('Recipe 3')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  test('renders pagination when there are multiple pages', () => {
    const mockRecipes = [{ id: 1, title: 'Recipe 1' }];
    const mockPagination = { page: 2, pages: 5, count: 50, pageSize: 10 };

    render(
      <RecipeGrid
        recipes={mockRecipes}
        pagination={mockPagination}
        isLoading={false}
        selectedIngredientsCount={0}
        onPageChange={mockOnPageChange}
        onDeleteRecipe={mockOnDeleteRecipe}
      />
    );

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  test('does not render pagination when there is only one page', () => {
    const mockRecipes = [{ id: 1, title: 'Recipe 1' }];
    const mockPagination = { page: 1, pages: 1, count: 1, pageSize: 10 };

    render(
      <RecipeGrid
        recipes={mockRecipes}
        pagination={mockPagination}
        isLoading={false}
        selectedIngredientsCount={0}
        onPageChange={mockOnPageChange}
        onDeleteRecipe={mockOnDeleteRecipe}
      />
    );

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  test('calls onPageChange when pagination next button is clicked', async () => {
    const user = userEvent.setup();
    const mockRecipes = [{ id: 1, title: 'Recipe 1' }];
    const mockPagination = { page: 2, pages: 5, count: 50, pageSize: 10 };

    render(
      <RecipeGrid
        recipes={mockRecipes}
        pagination={mockPagination}
        isLoading={false}
        selectedIngredientsCount={0}
        onPageChange={mockOnPageChange}
        onDeleteRecipe={mockOnDeleteRecipe}
      />
    );

    await user.click(screen.getByText('Next'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('passes proper props to RecipeCard', () => {
    const mockRecipes = [{ id: 1, title: 'Recipe 1' }];
    const { RecipeCard } = require('./RecipeCard');

    render(
      <RecipeGrid
        recipes={mockRecipes}
        isLoading={false}
        selectedIngredientsCount={0}
        onPageChange={mockOnPageChange}
        onDeleteRecipe={mockOnDeleteRecipe}
      />
    );

    expect(RecipeCard).toHaveBeenCalledWith(
      expect.objectContaining({
        recipe: mockRecipes[0],
        onDeleteRecipe: mockOnDeleteRecipe
      }),
      expect.anything()
    );
  });
});
