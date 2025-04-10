# 👨‍🍳 lethimcook.food - recipe finder

A meme-inspired, modern recipe finder application that helps you discover recipes based on ingredients you have at home. Built with React, TypeScript, and Ruby on Rails.

Note: This is a work in progress. Initial load - first query to API takes a while because of fly.io setup.

## 🧠 Key Features

### 🔍 Smart Recipe Search
> Search by ingredients (with autocomplete) using full-text PostgreSQL search.

### 📝 Auth & Favorites
> Users can sign up, create recipes, save favorite ones, and generate AI recipes.

### 🪄 AI-Powered Recipes
> Describe what ingredients you have, and Claude (Mario) will cook a recipe just for you.

### ⛓️ Backend API (Rails 8)
- PostgreSQL with pg_search (possible migration to ElasticSearch in the future)
- Devise for authentication (session-based for initial simplicity, might migrate to JWT)
- Minitest for testing
- Panko Serializer for JSON serialization (better performance)
- Pagy for pagination (better performance)
- Anthropic for AI
- Fully versioned (`/api/v1`)
- Background jobs for AI generation
- Service objects and serializers for clean code separation

### 💻 Frontend (React 18 + TS)
- Component-based architecture
- Zustand for state management (lightweight, better performance, less code)
- React Query for fast API access
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

## 🗺️ Roadmap

### User Profile
- Good-looking user profile page (probably modal)
- Favorite ingredients/cuisines
- Reward/achievement system (gamification) - coins/points for creating a recipe and when it's getting favorited by other users etc.

### Groceries provider integration - order ingredients for your favorite recipes

### Recipes 
- Generate recipe image
- 

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

### Endpoints

- `GET /api/v1/recipes` - List recipes with optional ingredient filters
- `GET /api/v1/recipes/:id` - Get detailed recipe information
- `GET /api/v1/ingredients/search` - Search ingredients
- `GET /api/v1/favorites` - List favorites
- `POST /api/v1/favorites` - Create a favorite
- `DELETE /api/v1/favorites/:id` - Delete a favorite

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
npm run test

# Backend tests
cd api
rails test
```

