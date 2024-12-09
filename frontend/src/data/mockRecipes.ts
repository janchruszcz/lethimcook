import { Recipe } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Homemade Margherita Pizza',
    description: 'Classic Italian pizza with fresh basil, mozzarella, and tomatoes',
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&h=600',
    ingredients: [
      { id: 1, name: 'flour' },
      { id: 2, name: 'tomatoes' },
      { id: 3, name: 'mozzarella' },
      { id: 4, name: 'basil' },
      { id: 5, name: 'olive oil' }
    ],
    instructions: [
      'Prepare the pizza dough',
      'Spread tomato sauce',
      'Add fresh mozzarella',
      'Bake at 450°F for 12-15 minutes',
      'Garnish with fresh basil'
    ],
    cookingTime: 30,
    servings: 4
  },
  {
    id: 2,
    title: 'Creamy Mushroom Pasta',
    description: 'Rich and creamy pasta dish with sautéed mushrooms and herbs',
    imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=800&h=600',
    ingredients: [
      { id: 6, name: 'pasta' },
      { id: 7, name: 'mushrooms' },
      { id: 8, name: 'cream' },
      { id: 9, name: 'garlic' },
      { id: 10, name: 'parmesan' }
    ],
    instructions: [
      'Cook pasta al dente',
      'Sauté mushrooms and garlic',
      'Add cream and simmer',
      'Mix with pasta',
      'Top with parmesan'
    ],
    cookingTime: 25,
    servings: 3
  },
  {
    id: 3,
    title: 'Fresh Garden Salad',
    description: 'Light and refreshing salad with seasonal vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&h=600',
    ingredients: [
      { id: 11, name: 'lettuce' },
      { id: 12, name: 'tomatoes' },
      { id: 13, name: 'cucumber' },
      { id: 14, name: 'avocado' },
      { id: 15, name: 'olive oil' }
    ],
    instructions: [
      'Wash and chop vegetables',
      'Slice avocado',
      'Combine in a bowl',
      'Drizzle with olive oil',
      'Season to taste'
    ],
    cookingTime: 10,
    servings: 2
  }
];