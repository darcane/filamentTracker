# 🔌 API Documentation

## Overview

Filamentory provides a RESTful API with comprehensive endpoints for filament management, notes, and authentication.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Or use HttpOnly cookies (automatically handled by the frontend).

## Endpoints

### 🔐 Authentication (Public)

#### Request Magic Link Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Magic link sent to your email",
  "email": "user@example.com"
}
```

#### Verify Magic Link Token
```http
GET /api/auth/verify?token=123456-abc123-def456
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "email_verified": 1,
    "last_login": "2024-01-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Login successful"
}
```

#### Verify 6-digit Code
```http
POST /api/auth/verify-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

#### Refresh Access Token
```http
POST /api/auth/refresh
```

#### Logout User
```http
POST /api/auth/logout
```

#### Get Current User
```http
GET /api/auth/me
```

### 📦 Filaments (Protected)

**Authentication Required**: All filament endpoints require authentication via HttpOnly cookies or Bearer token. Unauthenticated requests will receive a `401 Unauthorized` response.

**User Isolation**: Each user can only access, create, update, and delete their own filaments. Requests return data scoped to the authenticated user's ID.

#### Get All Filaments
```http
GET /api/filaments
Authorization: Bearer YOUR_ACCESS_TOKEN
# OR use HttpOnly cookies (automatically sent by browser)
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication token

**Response:**
```json
[
  {
    "id": "filament-id",
    "user_id": "user-id",
    "brand": "Bambu Lab",
    "filamentType": "PLA",
    "typeModifier": "Basic",
    "color": "White",
    "amount": 1000,
    "cost": 25.99,
    "currency": "USD",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Filament by ID
```http
GET /api/filaments/:id
```

#### Create New Filament
```http
POST /api/filaments
Content-Type: application/json

{
  "brand": "Bambu Lab",
  "filamentType": "PLA",
  "typeModifier": "Basic",
  "color": "White",
  "amount": 1000,
  "cost": 25.99,
  "currency": "USD"
}
```

#### Update Filament
```http
PUT /api/filaments/:id
Content-Type: application/json

{
  "amount": 800,
  "cost": 24.99
}
```

#### Delete Filament
```http
DELETE /api/filaments/:id
```

#### Reduce Filament Amount
```http
PATCH /api/filaments/:id/reduce
Content-Type: application/json

{
  "amount": 50
}
```

### 📝 Notes (Protected)

#### Get All Notes
```http
GET /api/notes
```

#### Get Note by ID
```http
GET /api/notes/:id
```

#### Create New Note
```http
POST /api/notes
Content-Type: application/json

{
  "title": "Print Settings",
  "content": "Layer height: 0.2mm, Speed: 60mm/s",
  "category": "Print Settings"
}
```

#### Update Note
```http
PUT /api/notes/:id
Content-Type: application/json

{
  "title": "Updated Print Settings",
  "content": "Layer height: 0.15mm, Speed: 50mm/s",
  "category": "Print Settings"
}
```

#### Delete Note
```http
DELETE /api/notes/:id
```

### 📊 Analytics (Protected)

**Authentication Required**: All analytics endpoints require authentication. Returns statistics for the authenticated user's filaments only.

#### Get Total Filament Count
```http
GET /api/filaments/stats/total
Authorization: Bearer YOUR_ACCESS_TOKEN
# OR use HttpOnly cookies (automatically sent by browser)
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication token

**Response:**
```json
{
  "total": 15
}
```

#### Get Total Inventory Value
```http
GET /api/filaments/stats/value
```

**Response:**
```json
[
  {
    "currency": "USD",
    "total": 450.75
  },
  {
    "currency": "EUR",
    "total": 320.50
  }
]
```

#### Get Brand Statistics
```http
GET /api/filaments/stats/brands
```

**Response:**
```json
[
  {
    "brand": "Bambu Lab",
    "count": 5
  },
  {
    "brand": "Prusa",
    "count": 3
  }
]
```

### 🏥 Health Check

#### Server Health Status
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- **Authentication endpoints**: 3 requests per hour per IP+email
- **General API**: 100 requests per 15 minutes per IP
- **Token verification**: 5 attempts per 15 minutes per IP+token

## Interactive Documentation

Access the interactive Swagger UI at:
- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://yourdomain.com/api-docs`

## Data Models

See [Data Models](DATA_MODELS.md) for detailed TypeScript interfaces.

## Home Assistant Integration

See [Home Assistant Integration](HOME_ASSISTANT.md) for automation examples.
