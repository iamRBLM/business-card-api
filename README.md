# Business Card Management API

A production-ready RESTful API for managing users and business cards, built with Node.js, Express, TypeScript, and MongoDB. The service features Role-Based Access Control (RBAC), JWT authentication using `jose`, secure password hashing via `bcrypt`, data validation with `zod`, centralized error handling, and structured logging.

---

## 🛠 Tech Stack

- **Runtime & Language:** Node.js (ESM), TypeScript, `tsx`
- **Framework:** Express 5
- **Database & ODM:** MongoDB, Mongoose
- **Authentication & Security:** `jose` (JWT), `bcrypt`, CORS
- **Validation:** Zod
- **Logging & Diagnostics:** Pino, `pino-http`, `pino-pretty`, Custom Daily File Logging
- **Environment Management:** `@dotenvx/dotenvx`

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v20+)
- pnpm / npm / yarn
- MongoDB instance (local or MongoDB Atlas cluster)

### 2. Installation

Clone the repository and install dependencies:

```bash
pnpm install
```
