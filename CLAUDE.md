# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Filamentory is a multi-user web application for tracking 3D printer filament inventory with passwordless authentication. It features a React + TypeScript frontend, Node.js + Express backend, and SQLite database with complete data isolation between users.

## Development Setup

### Environment Configuration

Backend requires a `.env` file in `backend/` directory:
```
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@filamentory.com
APP_URL=http://localhost:3000
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Starting Development Servers

**Backend** (runs on port 5000):
```bash
cd backend
npm install
npm run dev
```

**Frontend** (runs on port 3000):
```bash
cd frontend
npm install
npm run dev
```

The frontend Vite dev server proxies `/api` requests to `http://localhost:5000`.

### Build Commands

**Backend**:
```bash
cd backend
npm run build        # Compile TypeScript to dist/
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm start            # Run production build
```

**Frontend**:
```bash
cd frontend
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Architecture

### Authentication Flow

Passwordless authentication using magic links and 6-digit codes:

1. **Login Request** (`POST /api/auth/login`):
   - User enters email
   - Backend generates unique token (format: `{6-digit-code}-{uuid}`)
   - Email sent via Resend with magic link and code
   - Token stored in `magic_tokens` table with 15-minute expiry

2. **Verification** (two methods):
   - **Magic Link**: `GET /api/auth/verify?token={full-token}` - user clicks email link
   - **Manual Code**: `POST /api/auth/verify-code` with email + 6-digit code

3. **Session Management**:
   - Access token (JWT, 15 min) stored in HttpOnly cookie
   - Refresh token (30 days) stored in HttpOnly cookie
   - Sessions tracked in `sessions` table
   - Auto-refresh handled by `AuthContext`

### Database Schema

SQLite database at `backend/data/filaments.db` with these tables:

- **users**: User accounts with email verification status
- **magic_tokens**: One-time login tokens with expiry
- **sessions**: Refresh token sessions
- **filaments**: User-specific filament inventory (brand, type, color, amount, cost)
- **notes**: User-specific notes (title, content, category)
- **cookie_consents**: GDPR cookie consent tracking

**Critical**: All data is scoped by `user_id`. The `DatabaseService` singleton (`services/database.ts`) requires `userId` for all CRUD operations.

### Backend Structure

- **Routes** (`routes/`): Express route handlers
  - `auth.ts`: Login, verification, token refresh, logout
  - `filaments.ts`: CRUD + reduce amount endpoint
  - `notes.ts`: CRUD operations

- **Middleware** (`middleware/`):
  - `auth.ts`: `authenticateToken()` - validates JWT from cookie/header, attaches `req.user`
  - `rateLimiter.ts`: Express rate limiting

- **Services** (`services/`):
  - `database.ts`: Singleton with Promise-based SQLite operations
  - `authService.ts`: Login flow, token verification, session management
  - `tokenService.ts`: JWT generation/verification, token expiry
  - `emailService.ts`: Resend email integration

- **Config** (`config/`):
  - `jwt.ts`: JWT secret, expiry, cookie settings
  - `email.ts`: Resend config, HTML email templates
  - `swagger.ts`: API documentation

### Frontend Structure

- **Contexts** (`contexts/`):
  - `AuthContext.tsx`: Authentication state, `useAuth()` hook
  - `ThemeContext.tsx`: Dark/light mode toggle with localStorage persistence
  - `CookieConsentContext.tsx`: GDPR cookie consent management

- **Components** (`components/`):
  - `auth/`: LoginForm, VerifyToken, CodeEntryForm, ProtectedRoute, LogoutButton
  - `MainApp.tsx`: Main application shell with tabs (Inventory, Notes)
  - `FilamentForm.tsx`: Add/edit filament modal
  - `FilamentTable.tsx`: Desktop table view with edit/delete/reduce actions
  - `FilamentCard.tsx`: Mobile card view
  - `NotesSection.tsx`: Notes CRUD interface

- **Services** (`services/`):
  - `api.ts`: Axios instance with interceptors for filament operations
  - `authApi.ts`: Authentication API calls
  - `notesApi.ts`: Notes API calls

- **Hooks** (`hooks/`):
  - `useAuth.ts`: Re-exports AuthContext hook
  - `useMediaQuery.ts`: Responsive breakpoints (mobile/tablet/desktop)

### Key Design Patterns

1. **User Isolation**: Every protected route/query filters by `req.user.id` from JWT
2. **Token Storage**: HttpOnly cookies prevent XSS attacks
3. **Magic Token Format**: `{code}-{uuid}` enables both link and manual entry
4. **Responsive Design**: Mobile-first with drawer navigation, desktop with tabs
5. **Material-UI**: Consistent theming via `ThemeContext`

## Common Tasks

### Adding a New Protected API Endpoint

1. Import `authenticateToken` middleware from `middleware/auth.ts`
2. Add route handler that uses `req.user.id` for data scoping:
```typescript
import { authenticateToken } from '../middleware/auth';
router.get('/items', authenticateToken, async (req, res) => {
  const items = await db.getItems(req.user!.id);
  res.json(items);
});
```

### Adding a Database Table

1. Update `DatabaseService.initializeTables()` in `services/database.ts`
2. Add foreign key to `user_id` for multi-user support:
```typescript
CREATE TABLE IF NOT EXISTS my_table (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  /* other columns */
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```
3. Create index: `CREATE INDEX IF NOT EXISTS idx_my_table_user_id ON my_table(user_id)`
4. Add CRUD methods that accept `userId` parameter

### Modifying Authentication

- Token generation: `services/tokenService.ts`
- Email templates: `config/email.ts` - modify `EMAIL_TEMPLATES`
- Token expiry: `config/jwt.ts` - update `JWT_CONFIG`
- Auth flow: `services/authService.ts`

### Frontend API Integration

1. Add type definitions in `types/`
2. Create API functions in `services/`:
```typescript
export const myApi = {
  getAll: async (): Promise<MyType[]> => {
    const response = await api.get('/my-endpoint');
    return response.data;
  }
};
```
3. Use in components with error handling

## API Documentation

Swagger UI available at `http://localhost:5000/api-docs` in development.

## Home Assistant Integration

The `/api/filaments/:id/reduce` endpoint allows reducing filament amounts via webhook after prints complete. See `docs/HOME_ASSISTANT.md` for automation setup.
