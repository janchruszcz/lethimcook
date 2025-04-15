# lethimcook.food API

This document provides details about the API endpoints for the lethimcook.food application.

## Authentication

Most endpoints that involve user-specific data (creating recipes, managing favorites) require authentication. Authentication is handled via Devise, likely using session cookies or tokens. Authenticated endpoints will require appropriate credentials (e.g., a valid `Authorization` header or session cookie). Requests requiring authentication that fail will typically return a `401 Unauthorized` status.

Endpoints are prefixed with `/api/v1`.

## Endpoints

### Authentication

#### `GET /auth/me`

*   **Description**: Retrieves the details of the currently authenticated user.
*   **Authentication**: Required.
*   **Successful Response (200 OK)**:
    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2023-10-27T10:00:00.000Z",
      "updated_at": "2023-10-27T10:00:00.000Z"
      // ... other user attributes ...
    }
    ```
*   **Error Response (401 Unauthorized)**:
    ```json
    {
      "error": "Not authenticated"
    }
    ```

### Recipes

#### `GET /api/v1/recipes`

*   **Description**: Retrieves a paginated list of recipes. Can be filtered by user ownership, favorites, or ingredients.
*   **Authentication**: Optional. Required if using `my_recipes=true` or `favorites=true`.
*   **Query Parameters**:
    *   `my_recipes` (Boolean, optional): If `true`, returns only recipes created by the authenticated user. Requires authentication.
    *   `favorites` (Boolean, optional): If `true`, returns only recipes favorited by the authenticated user. Requires authentication.
    *   `ingredients` (String, optional): Comma-separated list of ingredient names to filter by (e.g., `chicken,onion`).
    *   `exact` (Boolean, optional, default: `false`): If `true` and `ingredients` is present, recipes must contain *all* specified ingredients. If `false`, recipes containing *any* of the specified ingredients are returned.
    *   `page` (Integer, optional): The page number for pagination.
*   **Successful Response (200 OK)**:
    ```json
    {
      "success": true,
      "recipes": [
        {
          "id": 1,
          "title": "Example Recipe",
          "description": "A tasty example.",
          "ingredient_entries": ["1 cup flour", "2 eggs"],
          "instructions": ["Mix ingredients.", "Bake at 350F."],
          "image_url": "https://example.com/default_image.jpg",
          "prep_time": 10,
          "cook_time": 20,
          "total_time": 30,
          "ratings": 4.5,
          "ingredients": [],
          "cuisine": "Generic",
          "category": "Dessert",
          "author": "Chef",
          "is_favorite": false,
          "main_image": "https://example.com/default_image.jpg"
        }
        // ... more recipes ...
      ],
      "pagination": {
        "page": 1,
        "pages": 3,
        "count": 25,
        "items": 10
      }
    }
    ```

#### `GET /api/v1/recipes/:id`

*   **Description**: Retrieves details for a specific recipe.
*   **Authentication**: Not Required.
*   **URL Parameters**:
    *   `:id` (Integer, required): The ID of the recipe to retrieve.
*   **Successful Response (200 OK)**:
    ```json
    {
      "success": true,
      "recipe": {
        "id": 1,
        "title": "Example Recipe",
        // ... other recipe attributes ...
        "is_favorite": false // Will be true if authenticated user favorited it
      }
    }
    ```
*   **Error Response (404 Not Found)**: Standard Rails not found response if ID is invalid.

#### `POST /api/v1/recipes`

*   **Description**: Creates a new recipe associated with the authenticated user.
*   **Authentication**: Required.
*   **Request Body** (`application/json`):
    ```json
    {
      "recipe": {
        "title": "New Recipe Title",
        "description": "Optional description.",
        "image_url": "Optional image URL.",
        "prep_time": 15,
        "cook_time": 30,
        "cuisine": "Italian",
        "category": "Main Course",
        "author": "Optional author name",
        "main_image": null, // Or file upload data if handled
        "ingredient_entries": ["1 lb pasta", "1 jar sauce"],
        "instructions": ["Boil pasta.", "Heat sauce."]
      }
    }
    ```
*   **Successful Response (200 OK / 201 Created)**:
    ```json
    {
      "success": true,
      "recipe": {
        "id": 2,
        "title": "New Recipe Title",
        // ... other recipe attributes ...
        "is_favorite": false
      }
    }
    ```
*   **Error Response (422 Unprocessable Entity)**: If validation fails.
    ```json
    {
      "errors": {
        "title": ["can't be blank"]
        // ... other validation errors ...
      }
    }
    ```

#### `PUT/PATCH /api/v1/recipes/:id`

*   **Description**: Updates an existing recipe owned by the authenticated user.
*   **Authentication**: Required (User must own the recipe).
*   **URL Parameters**:
    *   `:id` (Integer, required): The ID of the recipe to update.
*   **Request Body** (`application/json`): Same format as `POST /api/v1/recipes`, containing fields to update.
*   **Successful Response (200 OK)**:
    ```json
    {
      "success": true,
      "recipe": {
        "id": 1,
        "title": "Updated Recipe Title",
        // ... other updated recipe attributes ...
      }
    }
    ```
*   **Error Response (404 Not Found)**: If recipe ID is invalid or not owned by the user.
*   **Error Response (422 Unprocessable Entity)**: If validation fails.

#### `DELETE /api/v1/recipes/:id`

*   **Description**: Deletes a recipe owned by the authenticated user.
*   **Authentication**: Required (User must own the recipe).
*   **URL Parameters**:
    *   `:id` (Integer, required): The ID of the recipe to delete.
*   **Successful Response (200 OK)**:
    ```json
    {
      "success": true
    }
    ```
*   **Error Response (404 Not Found)**: If recipe ID is invalid or not owned by the user.

### Ingredients

#### `GET /api/v1/ingredients`

*   **Description**: Retrieves a list of all available ingredients.
*   **Authentication**: Not Required.
*   **Successful Response (200 OK)**:
    ```json
    [
      {
        "id": 1,
        "name": "Flour",
        "created_at": "2023-10-27T11:00:00.000Z",
        "updated_at": "2023-10-27T11:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Sugar",
        // ...
      }
      // ... more ingredients ...
    ]
    ```

#### `GET /api/v1/ingredients/search`

*   **Description**: Searches for ingredients by name (case-insensitive).
*   **Authentication**: Not Required.
*   **Query Parameters**:
    *   `q` (String, required): The search term for ingredient names.
*   **Successful Response (200 OK)**: An array of matching ingredient objects, similar to `GET /api/v1/ingredients`.
    ```json
    [
      {
        "id": 5,
        "name": "Chicken Breast",
        // ...
      },
      {
        "id": 12,
        "name": "Chicken Stock",
        // ...
      }
    ]
    ```

### Favorites

#### `GET /api/v1/favorites`

*   **Description**: Retrieves a paginated list of the authenticated user's favorite recipes.
*   **Authentication**: Required.
*   **Query Parameters**:
    *   `page` (Integer, optional): The page number for pagination.
*   **Successful Response (200 OK)**: Same format as `GET /api/v1/recipes`, containing the user's favorite recipes.

#### `POST /api/v1/favorites`

*   **Description**: Adds a recipe to the authenticated user's favorites.
*   **Authentication**: Required.
*   **Request Body** (`application/json`):
    ```json
    {
      "recipe_id": 123 // ID of the recipe to favorite
    }
    ```
*   **Successful Response (200 OK)**:
    ```json
    {
      "success": true,
      "favorited": true
    }
    ```
*   **Error Response (404 Not Found)**: If the `recipe_id` is invalid.
*   **Error Response (422 Unprocessable Entity)**: If the recipe is already favorited.

#### `DELETE /api/v1/favorites/:id`

*   **Description**: Removes a recipe from the authenticated user's favorites.
*   **Authentication**: Required.
*   **URL Parameters**:
    *   `:id` (Integer, required): The ID of the *Recipe* to remove from favorites (not the favorite record ID).
*   **Successful Response (200 OK)**:
    ```json
    {
      "success": true,
      "favorited": false
    }
    ```
*   **Error Response (404 Not Found)**: If the recipe ID is invalid or was not favorited by the user.

### AI Chef

#### `POST /api/v1/ai/generate_recipe`

*   **Description**: Initiates an asynchronous background job to generate a recipe using AI based on provided ingredients.
*   **Authentication**: Not Required (though the generated recipe might need user association later).
*   **Request Body** (`application/json`):
    ```json
    {
      "ingredients": "chicken, broccoli, soy sauce"
    }
    ```
*   **Successful Response (200 OK)**: Returns the ID of the placeholder recipe created and confirms the job start.
    ```json
    {
      "recipeId": 55,
      "message": "Recipe generation started"
    }
    ```

#### `GET /api/v1/ai/recipe_status/:recipe_id`

*   **Description**: Checks the status and potentially retrieves the details of an AI-generated recipe.
*   **Authentication**: Not Required.
*   **URL Parameters**:
    *   `:recipe_id` (Integer, required): The ID returned by the `POST /api/v1/ai/generate_recipe` endpoint.
*   **Successful Response (200 OK - Pending/Complete)**: Returns the current recipe object, including its status (`pending`, `completed`, `failed`).
    ```json
    {
      "recipe": {
        "id": 55,
        "title": "AI Generated Recipe (Pending)", // Title might update
        "status": "pending", // or "completed", "failed"
        // ... other attributes might be populated when completed ...
      }
    }
    ```
*   **Response (200 OK - Not Found)**: Note: Returns 200 OK even if the recipe ID doesn't exist.
    ```json
    {
      "status": "failed",
      "error": "Recipe not found"
    }
    ```
