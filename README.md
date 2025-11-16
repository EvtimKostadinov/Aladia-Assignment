# NestJS Backend Monorepo Challenge

This repository contains the solution for the NestJS technical code challenge. The objective was to build a backend system using a monorepo structure, featuring a public API Gateway and a private Authentication microservice communicating internally via TCP.

The project demonstrates a scalable and maintainable architecture following the Controller → Service → Repository pattern.

## ✨ Features

- **Monorepo Structure:** Managed with NestJS CLI for optimal code sharing and organization.
- **Microservice Communication:** Internal TCP messaging between the Gateway and Authentication service.
- **Clean Architecture:** Strict adherence to Controller, Service, and Repository patterns.
- **Database Integration:** MongoDB with Mongoose for user persistence.
- **Validation:** DTOs with `class-validator` for robust request validation.
- **API Documentation:** Live API documentation via Swagger on the Gateway.
- **Configuration:** Type-safe and validated environment variable management using `@nestjs/config` and Joi.
- **Dockerized:** Fully containerized with `docker-compose` for easy setup and deployment.

## 🏛️ Architecture Overview

The system is composed of two main services that communicate over a private network. This separation ensures that the public-facing API is decoupled from the core business logic and data layer.

+-----------------+     +--------------------------+     +-------------------------------+     +-----------------+
|                 |     |                          |     |                               |     |                 |
|     Client      |---->|   Gateway (HTTP REST)    |---->|  Authentication (TCP Micro)   |---->|    MongoDB      |
| (Postman, etc.) |     |      (apps/gateway)      |     |   (apps/authentication)       |     |   (Database)    |
|                 |     |                          |     |                               |     |                 |
+-----------------+     +--------------------------+     +-------------------------------+     +-----------------+
                           |                          |     |                               |
                           |- Handles HTTP Requests   |     |- Contains Business Logic     |
                           |- Validates DTOs          |     |- Persists User Data          |
                           |- Exposes Swagger Docs    |     |- Hashes Passwords            |
                           +--------------------------+     +-------------------------------+

apps/gateway: The public entry point. It exposes a REST API, validates incoming requests, and communicates with other microservices. It contains no business logic.

apps/authentication: A private TCP-based microservice. It handles all user-related business logic, password hashing, and database interactions.

/ (Root): Contains shared code used across services, such as DTOs (common), configuration modules (config), and networking abstractions (core).

- **`apps/gateway`**: The public entry point. It exposes a REST API, validates incoming requests, and communicates with other microservices. It contains no business logic.
- **`apps/authentication`**: A private TCP-based microservice. It handles all user-related business logic, password hashing, and database interactions.
- **`/`** (Root): Contains shared code used across services, such as DTOs (`common`), configuration modules (`config`), and networking abstractions (`core`).

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **API**: REST with Swagger for documentation
- **Containerization**: Docker & Docker Compose
- **Validation**: `class-validator` & `class-transformer`
- **Configuration**: `@nestjs/config`

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose installed and running.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-repository-directory>
    ```

2.  **Create Environment Files:**
    You will need to create two `.env` files.
    - Create `apps/gateway/.env` and add the following:

      ```env
      # Port for the public-facing HTTP gateway
      PORT=3000

      # Connection details for the Authentication microservice (Docker hostname)
      AUTH_SERVICE_HOST=authentication
      AUTH_SERVICE_PORT=3001
      ```

    - Create `apps/authentication/.env` and add the following:

      ```env
      # Connection string for MongoDB (Docker hostname)
      MONGO_URI=mongodb://mongo:27017/auth_db

      # Port for the internal TCP microservice
      AUTH_PORT=3001
      ```

3.  **Run the application with Docker Compose:**
    This single command will build the images, create the containers, and start all services.
    ```bash
    docker-compose up --build
    ```

The application is now running!

- **API Gateway** is available at `http://localhost:3000`
- **Swagger API Documentation** is available at `http://localhost:3000/api`

## 🕹️ API Usage

You can use the interactive Swagger UI or any API client like Postman or `curl` to test the endpoints.

### 1. Register a New User

- **Endpoint:** `POST /auth/register`
- **Description:** Creates a new user in the database.
- **Request Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **cURL Example:**
  ```bash
  curl --location 'http://localhost:3000/auth/register' \
  --header 'Content-Type: application/json' \
  --data '{
      "email": "test@example.com",
      "password": "a-strong-password"
  }'
  ```
- **Success Response (201 Created):**
  ```json
  {
    "_id": "674c8be1a8f7c9e1c2d3e4f5",
    "email": "test@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

### 2. Get All Users

- **Endpoint:** `GET /auth/users`
- **Description:** Retrieves a list of all registered users.
- **cURL Example:**
  ```bash
  curl --location 'http://localhost:3000/auth/users'
  ```
- **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "674c8be1a8f7c9e1c2d3e4f5",
      "email": "test@example.com",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
  ```

## 🧠 Architectural Decisions & Highlights

- **Dedicated Networking Service**: A `NetworkingService` in the `core` library abstracts away the `ClientProxy` logic. This makes controllers in the Gateway cleaner and centralizes the microservice communication pattern.
- **Robust Error Handling**: The `authentication` service throws `RpcException`. The Gateway gracefully catches this and transforms it into a standard `HttpException`, ensuring that internal errors are correctly propagated to the client with the right status code.
- **Shared Configuration Module**: A dynamic `SharedConfigModule` provides reusable, validated, and type-safe configuration to any application in the monorepo, enforcing consistency.
- **Repository Pattern**: The `UsersRepository` strictly separates database logic from business logic in the service layer. This improves testability and maintainability by isolating data access concerns.

