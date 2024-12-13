# 👨‍🍳 lethimcook.food - recipe finder

A meme-inspired, modern recipe finder application that helps you discover recipes based on ingredients you have at home. Built with React, TypeScript, and Ruby on Rails.

## 🚀 Features

- Search recipes by ingredients with autocomplete
- View detailed recipe information including ingredients and instructions
- Mark recipes as favorites for later usage
- Basic user authentication system
- Responsive design with beautiful UI
- RESTful API with Rails backend
- PostgreSQL database

## 🛠 Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Query for data fetching
- Axios for API communication
- Lucide React for icons
- Vite as build tool

### Backend
- Ruby on Rails 8.0
- PostgreSQL with pg_search
- Devise for authentication
- Panko Serializer for JSON serialization
- Rack CORS for handling Cross-Origin requests

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
    ├── contexts/          # React context providers
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

