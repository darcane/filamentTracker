# 🔐 Authentication Guide

## Overview

Filamentory uses **passwordless authentication** with magic links and 6-digit codes for secure, user-friendly login.

## Authentication Flow

1. **Login Request**: User enters email address
2. **Email Sent**: System sends magic link + 6-digit code to email
3. **Two Options**:
   - **Option A**: Click magic link in email (automatic login)
   - **Option B**: Enter 6-digit code manually with 15-minute timer
4. **Session Created**: JWT tokens with automatic refresh
5. **Data Access**: User can access their private filament and notes data

## Features

### Magic Link Authentication
- **No Passwords**: Users never need to remember or manage passwords
- **Secure**: Each magic link is single-use and expires in 15 minutes
- **Convenient**: One-click login from email

### Code Entry Screen
- ⏱️ **15-minute Timer**: Visual countdown with progress bar
- 🔢 **6-digit Code**: Monospace input with automatic formatting
- 🔄 **Resend Option**: Request new code if expired
- ⚠️ **Expiration Handling**: Clear messaging when code expires
- 🔙 **Back to Login**: Easy return to email entry

### Keep Me Logged In
- ✅ **Checkbox Option**: Users can choose to stay logged in
- 📅 **Persistent Session**: When enabled, session lasts 30 days
- 🚪 **Session Cookies**: When disabled, session ends when browser closes
- 🔄 **Default Enabled**: "Keep me logged in" is checked by default

### Security Features
- 🚫 **Token Invalidation**: Old tokens automatically invalidated
- 🛡️ **Rate Limiting**: Protection against spam and abuse
- 🍪 **Secure Cookies**: HttpOnly cookies with automatic refresh
- 🔒 **Data Isolation**: Complete separation between user data

## API Endpoints

### Authentication (Public)
- `POST /api/auth/login` - Request magic link login
- `GET /api/auth/verify?token=xxx&rememberMe=true` - Verify magic link token (rememberMe defaults to true)
- `POST /api/auth/verify-code` - Verify 6-digit code manually (accepts rememberMe in body)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Session Types
- **Persistent Session** (`rememberMe: true`): Cookies persist for 30 days
- **Session Cookies** (`rememberMe: false`): Cookies expire when browser closes

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  email_verified: number;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}
```

### MagicToken
```typescript
interface MagicToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: number;
  created_at: string;
}
```

### Session
```typescript
interface Session {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
  last_used: string;
}
```

## Configuration

### Environment Variables
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Cookie Configuration
COOKIE_DOMAIN=localhost
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=3
```

## Troubleshooting

### Common Issues

1. **"Invalid or expired token"**: Token has expired (15 minutes) or already used
2. **"Too many requests"**: Rate limiting is active, wait before retrying
3. **Email not received**: Check spam folder, verify Resend configuration
4. **Code not working**: Ensure you're entering the 6-digit code correctly

### Security Best Practices

- Use strong JWT secrets in production
- Configure proper CORS origins
- Set up SSL certificates for production
- Monitor rate limiting and failed login attempts
- Regularly rotate JWT secrets
