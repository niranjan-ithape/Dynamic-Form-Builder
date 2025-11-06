## Quick context for AI coding assistants

This repository is a small Node/Express backend (under `backend/`) for a Dynamic Form Builder app. The backend is the main working code here and uses Express + Mongoose for a REST API with JWT-based auth.

Keep edits small and focused. Preserve existing patterns: controllers under `backend/controller/`, routes under `backend/routes/`, models under `backend/model/`, and DB setup in `backend/config/db.js`.

### High-level architecture
- Entry point: `backend/server.js` — loads environment, connects DB, registers routes and starts the Express server.
- DB: `backend/config/db.js` — connects to MongoDB via `process.env.MONGO_URI` using `mongoose`.
- Auth: `backend/controller/authController.js` (signup/signin), `backend/routes/authRoute.js` (routes mounted at `/api/auth`), and `backend/auth/authMiddleware.js` (JWT protect middleware).
- Models: `backend/model/UserModel.js` — Mongoose schema for users.

### Developer workflows / run commands
- Install dependencies for the backend:
  - Run in `backend/`: `npm install` (this repo uses the `backend/package.json`).
- Start the server:
  - Development: `npm run dev` (nodemon)
  - Production: `npm start`
- The server listens on `process.env.PORT` (defaults to 5000).

### Important environment variables
- `MONGO_URI` — MongoDB connection string (see `backend/config/db.js`). Example in `backend/.env`: `mongodb://localhost:27017/DynamicApp`.
- `JWT_SECRET` — JWT signing secret (used in `backend/auth/authMiddleware.js` and `backend/controller/authController.js`). Keep secret.
- `PORT` — optional override for server port.

### Patterns & project conventions (concrete examples)
- Route → Controller → Model pattern:
  - `backend/routes/authRoute.js` wires endpoints to handlers in `backend/controller/authController.js`.
  - Controllers return JSON and use Mongoose models directly (e.g. `User.findOne`, `User.create`). Keep this pattern when adding features.
- Auth flow:
  - Sign-up: POST `/api/auth/signup` — uses `registerController` to hash password with `bcryptjs`, create a user, and return a token via `generateToken`.
  - Sign-in: POST `/api/auth/signin` — `loginController` validates credentials and returns token and user info.
  - Protect middleware: `authMiddleware.protect` expects header `Authorization: Bearer <token>`; it decodes token using `process.env.JWT_SECRET` and sets `req.user`.
- Error handling: controllers currently return standard `res.status(...).json({ message })` on errors. Follow the same response shape for consistency.

### Integration points & external deps
- Uses `mongoose` for MongoDB, `express` for HTTP server, `jsonwebtoken` for JWTs, and `bcryptjs` for password hashing. See `backend/package.json`.
- DB connection options intentionally minimal in `backend/config/db.js` — avoid changing connection semantics without updating all environments.

### Editing guidance for AI agents
- Small, focused changes: prefer to add a new route + controller + model file rather than reshaping global app wiring.
- When adding new environment keys, update README and document example values in `.env.example` (if you add one).
- Use existing response shapes (JSON with `message` on error, or user object + `token` on auth success) to maintain compatibility with the front-end expectations.
- Add new middleware in `backend/auth/` and register it in routes (do not modify `server.js` routing layout without explicit reason).

### Files to inspect for context before editing
- `backend/server.js` — entry point and route mounting
- `backend/package.json` — scripts and dependencies
- `backend/controller/authController.js` — auth logic (examples for bcrypt + jwt usage)
- `backend/auth/authMiddleware.js` — JWT protect middleware example
- `backend/model/UserModel.js` — data schema patterns and timestamps usage
- `backend/config/db.js` — DB connect and failure handling

If anything in this file is unclear or you need more detail (for example: where forms and form-results are stored — not present in this backend yet), tell me what you'd like clarified and I will expand or merge with existing instructions.
