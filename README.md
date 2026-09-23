# Business Card Management API

A production-ready RESTful API for managing users and business cards, built with Node.js, Express, TypeScript, and MongoDB. The service features Role-Based Access Control (RBAC), JWT authentication using jose, secure password hashing via bcrypt, data validation with zod, centralized error handling, and structured logging.

---

## Tech Stack

- Runtime & Language: Node.js (ESM), TypeScript, tsx
- Framework: Express 5
- Database & ODM: MongoDB, Mongoose
- Authentication & Security: jose (JWT), bcrypt, CORS
- Validation: Zod
- Logging & Diagnostics: Pino, pino-http, pino-pretty, Custom Daily File Logging
- Environment Management: @dotenvx/dotenvx

---

## Getting Started

### 1. Prerequisites

- Node.js (v20+)
- pnpm / npm / yarn
- MongoDB instance (local or MongoDB Atlas cluster)

### 2. Installation

Clone the repository and install dependencies:

pnpm install

### 3. Environment Configuration

Create the environment files inside src/config/:

- src/config/.env (Global defaults)
- src/config/.env.development (Development configuration)
- src/config/.env.production (Production configuration)

Required environment variables:

- PORT=8080
- DB_CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/biz_cards_dev
- JWT_SECRET=your-secure-secret-key-at-least-32-chars-long
- CLIENT_URL=http://localhost:5173
- NODE_ENV=development
- LOG_LEVEL=info`

### 4. Running the Application

#### Development mode (with live reload & pretty logs)

- pnpm dev

#### Production mode

- pnpm prod

---

## Error Handling & Daily File Logging (Bonus Implemented)

The application implements a centralized error handling architecture combined with structured file logging:

- Centralized Middleware (errorHandler): Intercepts all runtime exceptions, JOSE/JWT token validation errors, malformed JSON body payloads, MongoDB uniqueness/constraint violations, and Zod validation errors.
- Daily Error Logs (logs/ directory): All client and server errors (HTTP status >= 400) are automatically appended to daily log files located at the root logs/ directory using the format YYYY-MM-DD.log.

[HH:MM:SS] <STATUS_CODE> <METHOD> <URL> - <ERROR_MESSAGE>

- 404 Catch-All Middleware: Missing endpoints are forwarded directly to the centralized handler via NotFoundError to guarantee all unhandled requests are logged.

---

## Authentication & Authorization

All protected routes require a Bearer token in the x-auth-token header (or standard Authorization: Bearer <token>):

- Public: Accessible to anyone.
- Registered User: Requires a valid signed JWT.
- Business User: Requires a valid JWT where isBusiness: true.
- Admin: Requires a valid JWT where isAdmin: true.
- Card Owner: The user who originally created the specific card.

---

## API Endpoints Specification

### User Management (/api/v1/users)

| #   | Method | Endpoint            | Access Level            | Description                                                           |
| --- | ------ | ------------------- | ----------------------- | --------------------------------------------------------------------- |
| 1   | POST   | /api/v1/users       | Public                  | Register a new user (isBusiness optional, password hashed via bcrypt) |
| 2   | POST   | /api/v1/users/login | Public                  | Authenticate user and receive a signed JWT token                      |
| 3   | GET    | /api/v1/users       | Admin                   | Retrieve all registered users                                         |
| 4   | GET    | /api/v1/users/:id   | Registered User / Admin | Retrieve a specific user by ID (Self or Admin)                        |
| 5   | PUT    | /api/v1/users/:id   | Registered User         | Update user profile information (Self only)                           |
| 6   | PATCH  | /api/v1/users/:id   | Registered User         | Toggle user isBusiness status (Self only)                             |
| 7   | DELETE | /api/v1/users/:id   | Registered User / Admin | Remove a user account (Self or Admin)                                 |

---

### Card Management (/api/v1/cards)

| #   | Method | Endpoint               | Access Level       | Description                                                |
| --- | ------ | ---------------------- | ------------------ | ---------------------------------------------------------- |
| 8   | GET    | /api/v1/cards          | Public             | Retrieve all business cards                                |
| 9   | GET    | /api/v1/cards/my-cards | Business User      | Retrieve all cards created by the authenticated user       |
| 10  | GET    | /api/v1/cards/:id      | Public             | Retrieve a specific card by ID                             |
| 11  | POST   | /api/v1/cards          | Business User      | Create a new business card (generates unique bizNumber)    |
| 12  | PUT    | /api/v1/cards/:id      | Card Owner         | Update a business card (Owner only)                        |
| 13  | PATCH  | /api/v1/cards/:id      | Registered User    | Toggle like status on a card (add/remove user ID in likes) |
| 14  | DELETE | /api/v1/cards/:id      | Card Owner / Admin | Delete a card (Card Owner or Admin)                        |

---

## Database Seeding (initDB)

On server startup, the application verifies collection states and automatically seeds:

- 3 Initial Users: Standard User, Business User, and Admin User (passwords properly hashed).
- 3 Initial Cards: Seeded cards linked to the initial Business User with unique sequential bizNumber values.
