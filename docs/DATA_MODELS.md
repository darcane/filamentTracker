# 📊 Data Models

## Overview

Filamentory uses SQLite with a multi-user architecture. All data is isolated by `user_id` to ensure complete separation between users.

## Database Tables

### users
User accounts and authentication information.

```typescript
interface User {
  id: string;                    // UUID primary key
  email: string;                 // User's email address (unique)
  email_verified: number;        // Boolean as integer (0/1)
  last_login: string | null;     // ISO timestamp of last login
  created_at: string;            // ISO timestamp of account creation
  updated_at: string;            // ISO timestamp of last update
}
```

### filaments
Filament inventory data (user-specific).

```typescript
interface Filament {
  id: string;                    // UUID primary key
  user_id: string;               // Foreign key to users.id
  brand: string;                 // Filament brand (e.g., "Bambu Lab")
  filamentType: string;          // Type (e.g., "PLA", "PETG", "ABS")
  typeModifier?: string;         // Modifier (e.g., "CF", "GF", "Silk")
  color: string;                 // Color description
  amount: number;                // Amount in grams
  cost: number;                  // Cost in specified currency
  currency: 'SEK' | 'EUR' | 'USD'; // Currency code
  createdAt: string;             // ISO timestamp of creation
  updatedAt: string;             // ISO timestamp of last update
}
```

### notes
User notes and tips (user-specific).

```typescript
interface Note {
  id: string;                    // UUID primary key
  user_id: string;               // Foreign key to users.id
  title: string;                 // Note title
  content: string;               // Note content (markdown supported)
  category: string;              // Category (e.g., "Print Settings", "Spool Weights")
  created_at: string;            // ISO timestamp of creation
  updated_at: string;            // ISO timestamp of last update
}
```

### magic_tokens
Magic link tokens for passwordless authentication.

```typescript
interface MagicToken {
  id: string;                    // UUID primary key
  user_id: string;               // Foreign key to users.id
  token: string;                 // 6-digit code + UUID (e.g., "123456-abc123-def456")
  expires_at: string;            // ISO timestamp of expiration (15 minutes)
  used: number;                  // Boolean as integer (0/1)
  created_at: string;            // ISO timestamp of creation
}
```

### sessions
User sessions and refresh tokens.

```typescript
interface Session {
  id: string;                    // UUID primary key
  user_id: string;               // Foreign key to users.id
  refresh_token: string;         // JWT refresh token
  expires_at: string;            // ISO timestamp of expiration (30 days)
  created_at: string;            // ISO timestamp of creation
  last_used: string;             // ISO timestamp of last use
}
```

### cookie_consents
GDPR cookie consent preferences.

```typescript
interface CookieConsent {
  id: string;                    // UUID primary key
  user_id: string | null;        // Foreign key to users.id (nullable for anonymous)
  analytics_consent: number;     // Boolean as integer (0/1)
  marketing_consent: number;     // Boolean as integer (0/1)
  preferences_consent: number;   // Boolean as integer (0/1, always 1)
  ip_address: string;            // User's IP address
  user_agent: string;            // User's browser user agent
  consent_version: string;       // Version of consent form
  created_at: string;            // ISO timestamp of creation
  updated_at: string;            // ISO timestamp of last update
}
```

## Database Indexes

For optimal performance, the following indexes are created:

```sql
-- Filaments
CREATE INDEX idx_filaments_user_id ON filaments(user_id);
CREATE INDEX idx_filaments_brand ON filaments(brand);
CREATE INDEX idx_filaments_type ON filaments(filamentType);
CREATE INDEX idx_filaments_color ON filaments(color);
CREATE INDEX idx_filaments_created_at ON filaments(createdAt);

-- Magic Tokens
CREATE INDEX idx_magic_tokens_token ON magic_tokens(token);
CREATE INDEX idx_magic_tokens_expires_at ON magic_tokens(expires_at);

-- Sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);

-- Notes
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Cookie Consents
CREATE INDEX idx_cookie_consents_user_id ON cookie_consents(user_id);
```

## Relationships

### Foreign Key Constraints
- `filaments.user_id` → `users.id` (CASCADE DELETE)
- `notes.user_id` → `users.id` (CASCADE DELETE)
- `magic_tokens.user_id` → `users.id` (CASCADE DELETE)
- `sessions.user_id` → `users.id` (CASCADE DELETE)
- `cookie_consents.user_id` → `users.id` (SET NULL)

### Data Isolation
All user-specific data is filtered by `user_id`:
- Users can only access their own filaments
- Users can only access their own notes
- Magic tokens are user-specific
- Sessions are user-specific
- Cookie consents can be anonymous or user-specific

## Data Validation

### Filament Validation
- `amount`: Must be positive number
- `cost`: Must be positive number
- `currency`: Must be one of 'SEK', 'EUR', 'USD'
- `brand`: Required, non-empty string
- `filamentType`: Required, non-empty string
- `color`: Required, non-empty string

### Note Validation
- `title`: Required, non-empty string, max 255 characters
- `content`: Required, non-empty string
- `category`: Required, non-empty string

### User Validation
- `email`: Required, valid email format, unique
- `email_verified`: Must be 0 or 1

### Token Validation
- `token`: Required, unique, format: 6-digit code + UUID
- `expires_at`: Required, future timestamp
- `used`: Must be 0 or 1

## Schema Updates
When adding new fields:
1. Add column to database schema
2. Update TypeScript interfaces
3. Update API endpoints
4. Update frontend components
5. Update database schema if needed

## Performance Considerations

### Query Optimization
- Always filter by `user_id` first
- Use indexes for frequently queried fields
- Limit result sets with pagination
- Use prepared statements for security

### Data Size
- Monitor database file size
- Implement data retention policies
- Clean up expired tokens and sessions
- Archive old data if needed

## Security

### Data Protection
- All user data is isolated by `user_id`
- Sensitive data (tokens, sessions) are properly secured
- Input validation prevents SQL injection
- Prepared statements for all database queries

### Privacy
- Cookie consents are tracked for GDPR compliance
- User data can be deleted (CASCADE DELETE)
- Anonymous consent tracking is supported
- IP addresses are stored for consent tracking
