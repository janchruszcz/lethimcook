import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchSection } from './SearchSection';
import { useRecipeStore } from '../../stores/useRecipeStore';
import { useModalStore } from '../../stores/useModalStore';
import { useAuthStore } from '../../stores/useAuthStore';

// --- Mock Stores ---
jest.mock('../../stores/useRecipeStore');
jest.mock('../../stores/useModalStore');
jest.mock('../../stores/useAuthStore');

const mockedUseRecipeStore = useRecipeStore as jest.MockedFunction<typeof useRecipeStore>;
const mockedUseModalStore = useModalStore as jest.MockedFunction<typeof useModalStore>;
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// --- Mock Child Components ---
// We only need to know they render and receive props
jest.mock('./SearchBar', () => ({ SearchBar: jest.fn(() => <div data-testid="mock-search-bar" />) }));
jest.mock('./ExactMatchToggle', () => ({ ExactMatchToggle: jest.fn(({ checked, onChange }) => (
  <button data-testid="mock-exact-match" onClick={() => onChange(!checked)}>
    Exact Match: {checked ? 'On' : 'Off'}
  </button>
)) }));
jest.mock('../ui/Button', () => ({
  Button: jest.fn(({ children, onClick, disabled, ...props }) => (
    <button data-testid="mock-ai-button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )),
}));
jest.mock('../ai/AIChefModal', () => ({ AIChefModal: jest.fn(() => <div data-testid="mock-ai-modal" />) }));

// --- Test Suite ---
describe('SearchSection', () => {
  // Mock functions for store actions
  const mockUpdateIngredients = jest.fn();
  const mockUpdateExactMatch = jest.fn();
  const mockOpenAiChefModal = jest.fn();
  const mockCloseAiChefModal = jest.fn();

  // References to mocked components
  let MockSearchBar: jest.Mock;
  let MockExactMatchToggle: jest.Mock;
  let MockAIChefModal: jest.Mock;

  // Use dynamic import in beforeAll to get references *after* mocks are set up
  beforeAll(async () => {
    const searchBarModule = await import('./SearchBar');
    MockSearchBar = searchBarModule.SearchBar as jest.Mock;
    const exactMatchToggleModule = await import('./ExactMatchToggle');
    MockExactMatchToggle = exactMatchToggleModule.ExactMatchToggle as jest.Mock;
    const aiChefModalModule = await import('../ai/AIChefModal');
    MockAIChefModal = aiChefModalModule.AIChefModal as jest.Mock;
    // Note: Button is mocked but we removed the variable reference as it wasn't used
  });

  // Helper function to set up store mocks for a test
  const setupStoreMocks = (recipeState = {}, modalState = {}, authState = {}) => {
    mockedUseRecipeStore.mockReturnValue({
      filters: { ingredients: [], exactMatch: false },
      updateIngredients: mockUpdateIngredients,
      updateExactMatch: mockUpdateExactMatch,
      ...recipeState, // Allow overriding defaults
    });
    mockedUseModalStore.mockReturnValue({
      showAiChefModal: false,
      openAiChefModal: mockOpenAiChefModal,
      closeAiChefModal: mockCloseAiChefModal,
      ...modalState,
    });
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      ...authState,
    });
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set default store states
    setupStoreMocks();
  });

  test('renders correctly with default state', () => {
    render(<SearchSection />);

    expect(screen.getByText('Find Recipes')).toBeInTheDocument();
    expect(screen.getByTestId('mock-search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-exact-match')).toBeInTheDocument();
    expect(screen.getByTestId('mock-ai-button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-ai-modal')).toBeInTheDocument();

    // Check initial props passed to children
    expect(MockExactMatchToggle).toHaveBeenCalledWith(expect.objectContaining({ checked: false }), {});
    expect(MockSearchBar).toHaveBeenCalledWith(expect.objectContaining({ selectedIngredients: [] }), {});
    expect(MockAIChefModal).toHaveBeenCalledWith(expect.objectContaining({ ingredients: [], isOpen: false }), {});
  });

  test('calls updateExactMatch when toggle is clicked', async () => {
    setupStoreMocks({ filters: { ingredients: [], exactMatch: false } });
    const user = userEvent.setup();
    render(<SearchSection />);

    const toggle = screen.getByTestId('mock-exact-match');
    await user.click(toggle);

    expect(mockUpdateExactMatch).toHaveBeenCalledTimes(1);
    expect(mockUpdateExactMatch).toHaveBeenCalledWith(true); // It was false, click toggles to true
  });

  test('calls openAiChefModal when AI button is clicked (if enabled)', async () => {
    // Enable button: need >= 2 ingredients and authenticated
    setupStoreMocks(
      { filters: { ingredients: ['tomato', 'garlic'], exactMatch: false } },
      {},
      { isAuthenticated: true }
    );
    const user = userEvent.setup();
    render(<SearchSection />);

    const aiButton = screen.getByTestId('mock-ai-button');
    expect(aiButton).not.toBeDisabled();
    await user.click(aiButton);

    expect(mockOpenAiChefModal).toHaveBeenCalledTimes(1);
  });

  test('AI button is disabled if not enough ingredients', () => {
    setupStoreMocks(
      { filters: { ingredients: ['tomato'], exactMatch: false } }, // Only 1 ingredient
      {},
      { isAuthenticated: true } 
    );
    render(<SearchSection />);

    const aiButton = screen.getByTestId('mock-ai-button');
    expect(aiButton).toBeDisabled();
  });

  test('AI button is disabled if not authenticated', () => {
    setupStoreMocks(
      { filters: { ingredients: ['tomato', 'garlic'], exactMatch: false } }, // Enough ingredients
      {},
      { isAuthenticated: false } // Not authenticated
    );
    render(<SearchSection />);

    const aiButton = screen.getByTestId('mock-ai-button');
    expect(aiButton).toBeDisabled();
  });

  test('passes correct props to SearchBar', () => {
    const mockIngredients = ['onion', 'pepper'];
    setupStoreMocks({ filters: { ingredients: mockIngredients, exactMatch: true } });
    render(<SearchSection />);

    expect(MockSearchBar).toHaveBeenCalledTimes(1);
    expect(MockSearchBar).toHaveBeenCalledWith(
      expect.objectContaining({
        onIngredientsChange: mockUpdateIngredients, // Check if the correct function is passed
        selectedIngredients: mockIngredients,
      }),
      {} // Second arg for React component mocks
    );
  });

  test('passes correct props to AIChefModal', () => {
    const mockIngredients = ['cheese', 'bread'];
    setupStoreMocks(
      { filters: { ingredients: mockIngredients, exactMatch: false } },
      { showAiChefModal: true } // Modal is open
    );
    render(<SearchSection />);

    expect(MockAIChefModal).toHaveBeenCalledTimes(1);
    expect(MockAIChefModal).toHaveBeenCalledWith(
      expect.objectContaining({
        ingredients: mockIngredients,
        isOpen: true,
        onClose: mockCloseAiChefModal,
      }),
      {}
    );
  });
}); 