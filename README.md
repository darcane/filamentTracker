# Filamentory

A full-stack TypeScript application for tracking 3D printer filament inventory with multi-user support, passwordless authentication, and a modern React frontend.

## ✨ Features

### 🔐 Multi-User Authentication
- **Passwordless Login**: Magic link authentication via email (no passwords to remember!)
- **Secure Sessions**: JWT tokens with automatic refresh and 30-day persistence
- **User Isolation**: Complete data separation between users
- **Rate Limiting**: Protection against abuse and spam

### 📦 Filament Management
- **Add Filaments**: Quick-add form with dropdowns for brands, types, and currencies
- **Free Color Input**: Enter any color name or description (e.g., "Bambu Lab Gray", "Wood Brown")
- **Inventory Management**: View all filaments in a searchable, filterable, and sortable table
- **Real Brand Logos**: Visual brand identification with actual brand logos from the internet
- **Amount Tracking**: Track filament amounts in grams with reduction capabilities
- **Multi-Currency**: Support for SEK (default), EUR, and USD
- **View Toggle**: Switch between table and card views for better mobile experience

### 📝 Notes & Helpers
- **Personal Notes**: Store spool weights, print settings, and tips
- **Categories**: Organize notes by type (Spool Weights, Print Settings, Maintenance, etc.)
- **Rich Content**: Full-text notes with markdown support
- **User-Specific**: Notes are private to each user

### 🎨 User Experience
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Material-UI components with smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation support

### 🔗 Integrations
- **Home Assistant**: API endpoint for reducing filament amounts from Home Assistant
- **Email Service**: Resend integration for reliable magic link delivery
- **API Documentation**: Interactive Swagger UI for all endpoints

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Material-UI + React Router
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite with better-sqlite3 (fast, reliable, Git-friendly)
- **Authentication**: JWT tokens + Magic links via Resend
- **Security**: Rate limiting, CORS, httpOnly cookies, CSRF protection
- **API**: RESTful endpoints with comprehensive Swagger documentation

## 📁 Project Structure

```
Filamentory/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── consent/        # Cookie consent components
│   │   │   └── ...             # Other UI components
│   │   ├── contexts/           # React contexts (Auth, Theme)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API clients
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Utility functions
│   └── public/logos/           # Brand logo assets
├── backend/                    # Express backend API
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   ├── email.ts        # Email service config
│   │   │   ├── jwt.ts          # JWT configuration
│   │   │   └── swagger.ts      # API documentation
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.ts         # Authentication middleware
│   │   │   └── rateLimiter.ts  # Rate limiting
│   │   ├── routes/             # API route handlers
│   │   │   ├── auth.ts         # Authentication routes
│   │   │   ├── filaments.ts    # Filament management
│   │   │   └── notes.ts        # Notes management
│   │   ├── services/           # Business logic & database
│   │   │   ├── authService.ts  # Authentication logic
│   │   │   ├── emailService.ts # Email sending
│   │   │   ├── tokenService.ts # JWT token management
│   │   │   └── database.ts     # Database operations
│   │   ├── scripts/            # Migration scripts
│   │   └── types/              # Shared TypeScript types
│   └── data/                   # SQLite database storage
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Resend account (for email authentication) - [Sign up here](https://resend.com)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=30d

   # Email Service (Resend)
   RESEND_API_KEY=re_xxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   APP_URL=http://localhost:3000

   # App Configuration
   NODE_ENV=development
   PORT=5000

   # Security
   COOKIE_DOMAIN=localhost
   COOKIE_SECURE=false
   CORS_ORIGIN=http://localhost:3000

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=3600000
   RATE_LIMIT_MAX_REQUESTS=3
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

### 🔐 Authentication Setup

1. **Sign up for Resend**: Create an account at [resend.com](https://resend.com)
2. **Get API Key**: Generate an API key from your Resend dashboard
3. **Configure Email**: Add your API key to the `.env` file
4. **Test Email**: Use Resend's test domain for development

### 📊 Database Migration (if upgrading from JSON)

If you have existing JSON data, run the migration script:

```bash
cd backend
npm run migrate
```

This will:
- Import existing JSON data to SQLite
- Create a backup of your JSON file
- Set up the database with proper indexes
- Create user tables for multi-user support

## 🔌 API Endpoints

### 🔐 Authentication (Public)

- `POST /api/auth/login` - Request magic link login
- `GET /api/auth/verify?token=xxx` - Verify magic link token
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### 📦 Filaments (Protected)

- `GET /api/filaments` - Get all filaments for authenticated user
- `GET /api/filaments/:id` - Get filament by ID
- `POST /api/filaments` - Create new filament
- `PUT /api/filaments/:id` - Update filament
- `DELETE /api/filaments/:id` - Delete filament
- `PATCH /api/filaments/:id/reduce` - Reduce filament amount

### 📝 Notes (Protected)

- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### 📊 Analytics Endpoints (Protected)

- `GET /api/filaments/stats/total` - Get total filament count
- `GET /api/filaments/stats/value` - Get total inventory value by currency
- `GET /api/filaments/stats/brands` - Get brand statistics

### 🏥 Health Check

- `GET /health` - Server health status

### 📚 API Documentation

- `GET /api-docs` - Interactive Swagger UI documentation

## 📚 API Documentation

The backend includes comprehensive Swagger/OpenAPI documentation that you can access at:

**http://localhost:5000/api-docs**

This interactive documentation allows you to:
- View all available endpoints
- See request/response schemas
- Test API endpoints directly from the browser
- Download the OpenAPI specification
- View authentication requirements for each endpoint

## 🏠 Home Assistant Integration

The application provides an API endpoint for Home Assistant to reduce filament amounts when prints are completed:

```yaml
# Example Home Assistant automation
automation:
  - alias: "Reduce Filament After Print"
    trigger:
      platform: state
      entity_id: sensor.printer_status
      to: "idle"
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "your-filament-id"
          amount: "{{ states('sensor.print_weight') | float }}"

rest_command:
  reduce_filament:
    url: "http://localhost:5000/api/filaments/{{ filament_id }}/reduce"
    method: PATCH
    headers:
      Content-Type: "application/json"
      Authorization: "Bearer YOUR_ACCESS_TOKEN"  # Add authentication
    payload: '{"amount": {{ amount }}}'
```

**Note**: The API now requires authentication. You'll need to:
1. Generate an access token from your user account
2. Include it in the Authorization header
3. Or use a service account for Home Assistant integration

## 📊 Data Models

### Filament
```typescript
interface Filament {
  id: string;
  user_id: string;        // User who owns this filament
  brand: string;
  filamentType: string;   // PLA, PETG, ABS, etc.
  typeModifier?: string;  // CF, GF, Silk, Matte, etc.
  color: string;
  amount: number;         // grams
  cost: number;
  currency: 'SEK' | 'EUR' | 'USD';
  createdAt: string;
  updatedAt: string;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  email_verified: number;  // boolean as integer
  last_login: string | null;
  created_at: string;
  updated_at: string;
}
```

### Note
```typescript
interface Note {
  id: string;
  user_id: string;        // User who owns this note
  title: string;
  content: string;
  category: string;       // Spool Weights, Print Settings, etc.
  created_at: string;
  updated_at: string;
}
```

### Authentication
```typescript
interface MagicToken {
  id: string;
  user_id: string;
  token: string;          // 6-digit code + UUID
  expires_at: string;     // 15 minutes from creation
  used: number;           // boolean as integer
  created_at: string;
}

interface Session {
  id: string;
  user_id: string;
  refresh_token: string;  // JWT refresh token
  expires_at: string;     // 30 days from creation
  created_at: string;
  last_used: string;
}
```

## 🏷️ Supported Brands

- Bambu Lab
- SUNLU
- Creality
- eSun
- Polymaker
- Prusa
- Hatchbox
- Overture
- MatterHackers
- ColorFabb
- Fillamentum
- FormFutura
- Other (custom input)

## 🧵 Supported Filament Types

- PLA, PETG, ABS, TPU, ASA, Nylon, PC, PVA, HIPS
- Wood, Metal, Carbon Fiber, Glass Fiber
- Other (custom input)

## 🔒 Security Features

- **Passwordless Authentication**: No passwords to manage or forget
- **JWT Tokens**: Secure, stateless authentication
- **Rate Limiting**: Protection against brute force attacks
- **HttpOnly Cookies**: XSS protection for tokens
- **CSRF Protection**: SameSite cookie attributes
- **Data Isolation**: Complete separation between users
- **Input Validation**: Sanitized inputs and email validation
- **Token Expiration**: Short-lived access tokens (15 minutes)
- **Session Management**: Automatic token refresh

## 🛠️ Development

### Adding New Brand Logos

1. Add SVG/PNG logo files to `frontend/public/logos/`
2. Update the brand name in `BRAND_OPTIONS` if needed
3. The `BrandLogo` component will automatically detect and display the logo

### Authentication Flow

The authentication system works as follows:

1. **Login Request**: User enters email → `POST /api/auth/login`
2. **Magic Link Generation**: Backend creates 6-digit code + UUID token
3. **Email Delivery**: Resend sends magic link to user's email
4. **Token Verification**: User clicks link → `GET /api/auth/verify?token=xxx`
5. **Session Creation**: Backend generates JWT access + refresh tokens
6. **Cookie Setting**: Tokens stored in httpOnly cookies
7. **User Access**: Frontend loads user data and redirects to app

### Database Schema

The application uses SQLite with the following tables:
- `users` - User accounts and profiles
- `filaments` - Filament inventory (with user_id)
- `notes` - User notes and tips (with user_id)
- `magic_tokens` - One-time login tokens
- `sessions` - User sessions and refresh tokens
- `cookie_consents` - GDPR consent tracking

### Environment Variables

Key environment variables for production:
- `JWT_SECRET` - Strong secret for JWT signing
- `RESEND_API_KEY` - Email service API key
- `FROM_EMAIL` - Sender email address
- `APP_URL` - Application URL for magic links
- `COOKIE_DOMAIN` - Cookie domain for production
- `CORS_ORIGIN` - Allowed frontend origins

## 🚀 Production Deployment

### Prerequisites
- Domain name with DNS access
- SSL certificate (Let's Encrypt recommended)
- Resend account with verified domain
- Hosting platform (Vercel, Railway, DigitalOcean, etc.)

### Deployment Checklist
- [ ] Set strong `JWT_SECRET` environment variable
- [ ] Configure `RESEND_API_KEY` with verified domain
- [ ] Set production `APP_URL` and `CORS_ORIGIN`
- [ ] Enable HTTPS and secure cookies
- [ ] Run database migrations
- [ ] Test authentication flow
- [ ] Verify email delivery
- [ ] Set up monitoring and logging

### Cost Estimation
- **Email Service**: Free tier (3,000 emails/month) or $20/month (50,000 emails)
- **Hosting**: $5-20/month depending on platform
- **Domain**: $10-15/year
- **Total**: ~$0-35/month for most use cases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful component library
- [Resend](https://resend.com/) for reliable email delivery
- [React](https://reactjs.org/) and [Node.js](https://nodejs.org/) communities
- All the 3D printing enthusiasts who inspired this project!
