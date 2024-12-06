# Let Him Cook - Recipe Finder

A meme-inspired, modern recipe finder application that helps you discover recipes based on ingredients you have at home. Built with React, TypeScript, and Ruby on Rails.

## 🚀 Features

- Search recipes by ingredients with autocomplete
- View detailed recipe information including ingredients and instructions
- Mark recipes as favorites for later usage
- Basic user authentication system
- Responsive design with beautiful UI
- RESTful API with Rails backend
- PostgreSQL database for robust data storage

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
- PostgreSQL
- Devise for authentication
- Panko Serializer for JSON serialization
- Rack CORS for handling Cross-Origin requests
- Docker support for containerization
- Kamal for deployment

## 🏗 Project Structure

.
├── api/ # Rails API backend
│ ├── app/ # Rails application code
│ ├── config/ # Rails configuration
│ └── db/ # Database migrations and schema
└─�� src/ # React frontend
├── api/ # API client and services
├── components/ # React components
├── contexts/ # React context providers
└── types/ # TypeScript type definitions

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
- `GET /api/v1/ingredients` - List all ingredients
- `GET /api/v1/ingredients/search` - Search ingredients

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
RAILS_MASTER_KEY=<your-master-key>
API_DATABASE_PASSWORD=<your-database-password>
```

## 🧪 Testing

```bash
# Frontend tests
npm run test

# Backend tests
cd api
rails test
```

## 📦 Deployment

The project uses Kamal for deployment. Configure your deployment settings in `api/config/deploy.yml` and use:

```bash
cd api
bin/kamal deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
