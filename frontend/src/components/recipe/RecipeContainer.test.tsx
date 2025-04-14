import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecipeContainer } from './RecipeContainer';
import { useRecipeStore } from '../../stores/useRecipeStore';
import { RecipeGridProps } from './RecipeGrid'; // Import props type for mocking

// Mock the RecipeGrid component
jest.mock('./RecipeGrid', () => ({
  // We use jest.fn() so we can assert that it was called with correct props
  RecipeGrid: jest.fn((props: RecipeGridProps) => (
    <div data-testid="mock-recipe-grid">
      {/* Optionally render some prop values for easier debugging/assertion */}
      <span data-testid="recipe-count">{props.recipes.length}</span>
      {props.isLoading && <span data-testid="loading">Loading...</span>}
    </div>
  )),
}));

// Mock the Zustand store
// Keep track of the original state to reset between tests
const originalState = useRecipeStore.getState();

// Mock the entire store module
jest.mock('../../stores/useRecipeStore');

// Type assertion for the mocked store hook
const mockedUseRecipeStore = useRecipeStore as jest.MockedFunction<typeof useRecipeStore>;

describe('RecipeContainer', () => {
  // Get a reference to the mocked RecipeGrid component
  // We need to require it *after* the mock is set up
  let MockRecipeGrid: jest.Mock;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    MockRecipeGrid = require('./RecipeGrid').RecipeGrid;
  });

  beforeEach(() => {
    // Reset store state before each test
    useRecipeStore.setState(originalState);
    // Reset mock component calls/instances
    MockRecipeGrid.mockClear();
    // Reset the mock store hook's implementation for each test
    mockedUseRecipeStore.mockClear();
  });

  test('renders loading state correctly', () => {
    // Arrange: Set store state to loading
    mockedUseRecipeStore.mockReturnValue({
      recipes: [],
      pagination: { page: 1, items: 10, totalItems: 0, totalPages: 0 },
      isLoading: true,
      filters: {},
      updatePage: jest.fn(),
      deleteRecipe: jest.fn(),
      // Add any other properties returned by the hook with default/mock values
    });

    // Act
    render(<RecipeContainer />);

    // Assert
    // Check that RecipeGrid was called with isLoading = true
    expect(MockRecipeGrid).toHaveBeenCalledTimes(1);
    expect(MockRecipeGrid).toHaveBeenCalledWith(
      expect.objectContaining({ isLoading: true, recipes: [] }),
      expect.anything() // Second argument for ref (if any), otherwise ignored
    );

    // Optionally, check the output of the mocked RecipeGrid
    expect(screen.getByTestId('mock-recipe-grid')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByTestId('recipe-count')).toHaveTextContent('0');
  });

  test('renders recipe data correctly', () => {
    // Arrange: Set store state with some recipes
    const mockRecipes = [
      { id: '1', title: 'Recipe 1', instructions: 'Instr 1', image_url: '', created_at: '', updated_at: '', ingredient_entries: [] },
      { id: '2', title: 'Recipe 2', instructions: 'Instr 2', image_url: '', created_at: '', updated_at: '', ingredient_entries: [] },
    ];
    mockedUseRecipeStore.mockReturnValue({
      recipes: mockRecipes,
      pagination: { page: 1, items: 10, totalItems: 2, totalPages: 1 },
      isLoading: false,
      filters: { ingredients: ['tomato'] }, // Example filter
      updatePage: jest.fn(),
      deleteRecipe: jest.fn(),
    });

    // Act
    render(<RecipeContainer />);

    // Assert
    expect(MockRecipeGrid).toHaveBeenCalledTimes(1);
    expect(MockRecipeGrid).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: false,
        recipes: mockRecipes,
        selectedIngredientsCount: 1, // Derived from filters.ingredients.length
      }),
      expect.anything()
    );

    // Check the output of the mocked RecipeGrid
    expect(screen.getByTestId('mock-recipe-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('recipe-count')).toHaveTextContent('2');
  });

  // Add more tests for different states (e.g., pagination changes, filter changes affecting props)
}); 