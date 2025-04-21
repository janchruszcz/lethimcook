# 👨‍🍳 lethimcook.food - recipe finder

✨ A meme-inspired, modern recipe finder application that helps you discover recipes based on ingredients you have at home. Built with React, TypeScript, and Ruby on Rails 🍝

Note: This is a work in progress. Initial load - first query to API takes a while because of fly.io setup.

## 🧠 Key Features

### 🔍 Smart Recipe Search

![search](https://github.com/user-attachments/assets/7175ca89-85c7-438e-9104-4089e99c3e82)

> Search by ingredients (with autocomplete) using full-text PostgreSQL search.

### 🪄 AI-Powered Recipes

![mario2](https://github.com/user-attachments/assets/c1167cfc-e5fd-42d0-b495-24f1c6252987)

> Describe what ingredients you have, and Mario will cook a recipe just for you.

### 📝 Auth & Favorites
> Users can sign up, create recipes, save favorite ones

### ⛓️ Backend API (Rails 8)
- PostgreSQL with pg_search (possible migration to ElasticSearch in the future)
- Devise for authentication (session-based for initial simplicity, might migrate to JWT)
- Minitest for testing
- Panko Serializer for JSON serialization (better performance)
- Pagy for pagination (better performance)
- Anthropic for AI
- RESTful API design with versioning (`/api/v1`)
- Background jobs (Solid Queue) for AI generation
- Service objects and serializers for clean code separation

### 💻 Frontend (React 18, TypeScript)
- Component-based architecture
- Zustand for state management (lightweight, better performance, less code)
- React Query for data fetching with optimized caching strategies for better UX and reduced API calls
- Tailwind CSS for modern responsive UI
- Axios for API communication
- Vite as build tool

## 🏗 Project Structure

```
.
├── api/                   # Rails API backend
│   ├── app/               # Rails application code
│   ├── config/            # Rails configuration
│   └── db/                # Database migrations and schema
└── frontend/              # React frontend
    ├── api/               # API client and services
    ├── components/        # React components
    ├── stores/            # Zustand stores
    └── types/             # TypeScript type definitions
```

## 🔧 Technical Considerations, Notes & Improvements

### Database & Backend

- Recipe many-to-many relationship with Ingredients via RecipeIngredients is a relic of initial database structure and initial app idea. Currently we use ingredient_entries(string[]) column in recipes table to give users full freedom of input (simplicity and rapidness of development was also important here). In the future we might consider scanning these entries to extract the ingredient and create the relationship, which then would allow us to do more fancy stuff in terms of UX (e.g. ingredient unit/alias) or more professional in terms of engineering (e.g. easier recipes grouping, without need to do a full-text search).

- Favorite is a separate model because in the future we would like to have favorite ingredients/cuisines also (see Product Roadmap).

- Some Rails model validations exist primarily to support test cases — input validation is mostly delegated to the frontend or database constraints. This approach was recommended by DHH.

- Consider migrating from pg_search to ElasticSearch.

- Increase test coverage. Crucial parts are rather covered, but it is always good to aim for better coverage.

- Implement server-side caching.

### Frontend

- Review existing types, add missing ones.

- Increase test coverage, frontend test suite is very basic at the moment.

## 🗺️ Product Roadmap

### User Profile
- Good-looking user profile page (modal)
- Favorite ingredients/cuisines
- Reward/achievement system - coins/points for creating a recipe and when it's getting favorited by other users etc.

### Groceries
- Research groceries vs delivery provider integration
- Order favorite/frequently used ingredients
- Pantry - favorite/frequently used ingredients - possible AI suggestions on what to refill soon etc. (FRIDGE-AI)

### Recipes
- Fancy-o-meter - how fancy/spicy generated recipe should be - user config for generated recipes
- Generate recipe image
- Friendly urls
- Generate recipe based on macros (kcal, proteins, carbs, fats)
- Generate whole eating plan (recipes) for i.e. one week based on macros/ingredients
- Ranking - most favorited / best rated recipes should appear on the top of the list
- Analyze favorite vs rating

## 👨‍🍳 User Stories

### Recipe Discovery
- As a home cook, I want to input ingredients I have on hand, so I can find recipes that match my available ingredients
- As a busy parent, I want to see recipe cooking times upfront, so I can choose recipes that fit my schedule

### Recipe Management
- As a user, I want to save recipes to my favorites, so I can quickly access them later
- As a beginner cook, I want to see detailed cooking instructions, so I can follow recipes accurately
- As a mobile user, I want to access recipes on my phone while cooking, so I can follow along step by step

### User Experience
- As a user, I want to create an account, so I can personalize my recipe experience
- As a returning user, I want to log in securely, so I can access my favorite recipes
- As a visual learner, I want to see recipe photos, so I can understand what I'm making

### Social Features
- As a user, I want to see recipe ratings, so I can choose well-tested recipes
- As a community member, I want to see who authored the recipe, so I can find more recipes from creators I trust

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Ruby 3.2.2
- PostgreSQL
- Docker (optional)

### Development Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd lethimcook
```

2. Install frontend dependencies:

```bash
npm install
```

3. Setup backend:

```bash
cd api
bundle install
rails db:create db:migrate db:seed
```

4. Start the development servers:

In one terminal (for frontend):

```bash
npm run dev
```

In another terminal (for backend):

```bash
npm run api
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🐳 Docker Setup

The project includes Docker support for production deployment. To build and run using Docker:

```bash
cd api
docker build -t lethimcook .
docker run -d -p 80:80 -e RAILS_MASTER_KEY=<your-master-key> --name lethimcook lethimcook
```

## 📝 API Documentation

[Read here.](./api/README.md)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=<your-api-base-url>
RAILS_MASTER_KEY=<your-master-key>
DATABASE_URL=<your-database-url>
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd api
rails test
```

