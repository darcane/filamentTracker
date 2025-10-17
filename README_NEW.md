# 🖨️ Filamentory

**Your 3D Printer Filament Tracker**

A modern, multi-user web application for tracking 3D printer filament inventory with passwordless authentication, notes management, and beautiful responsive design.

![Filamentory Logo](https://via.placeholder.com/200x80/1976d2/ffffff?text=Filamentory)

## ✨ Features

### 📦 Filament Management
- **Complete Inventory**: Track brand, type, color, amount, and cost
- **Multi-Currency Support**: SEK, EUR, USD with automatic conversion
- **Usage Tracking**: Reduce filament amounts after prints
- **Analytics**: View statistics, total value, and brand distribution
- **User-Specific**: Each user has their own private filament inventory

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
- **Passwordless Authentication**: No passwords to remember - just email and magic links
- **Dual Login Options**: Magic link OR 6-digit code with visual timer
- **Cookie Consent**: GDPR-compliant cookie management with granular preferences

### 🔐 Authentication & Security
- **Passwordless Login**: Magic link authentication with 6-digit code fallback
- **Token Management**: Automatic token invalidation and refresh
- **Rate Limiting**: Protection against abuse and spam attacks
- **Secure Sessions**: HttpOnly cookies with automatic refresh
- **Multi-User Support**: Complete data isolation between users
- **GDPR Compliance**: Cookie consent management with granular controls

### 🔗 Integrations
- **Home Assistant**: API endpoint for reducing filament amounts from Home Assistant
- **Email Service**: Resend integration for reliable magic link delivery
- **API Documentation**: Interactive Swagger UI for all endpoints

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Material-UI + React Router
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite with multi-user support
- **Authentication**: JWT + Magic Links + Resend Email Service
- **Security**: Rate limiting, CORS, HttpOnly cookies
- **Development**: Hot reload, TypeScript, ESLint, Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Resend account for email service

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/filamentory.git
   cd filamentory
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `backend/.env`:
   ```env
   # Email Service (Required)
   RESEND_API_KEY=re_your_api_key_here
   FROM_EMAIL=noreply@yourdomain.com
   APP_URL=http://localhost:3000

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

4. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

### 🔐 Authentication Setup

### Email Service Configuration

1. **Sign up for Resend**: Create an account at [resend.com](https://resend.com)
2. **Get API Key**: Generate an API key from your Resend dashboard
3. **Configure Email**: Add your API key to the `.env` file
4. **Test Email**: Use Resend's test domain for development

### Authentication Flow

Filamentory uses **passwordless authentication** with magic links and 6-digit codes:

1. **Login Request**: User enters email → system sends magic link + 6-digit code
2. **Two Options**:
   - **Magic Link**: Click the link in email (automatic login)
   - **Manual Code**: Enter 6-digit code with 15-minute timer
3. **Token Management**: Old tokens are automatically invalidated when new ones are requested
4. **Session Security**: JWT tokens with automatic refresh and 30-day persistence

### Authentication Features

- ✅ **Passwordless Login**: No passwords to remember or manage
- ✅ **Dual Verification**: Magic link OR manual code entry
- ✅ **Timer Display**: 15-minute countdown with visual progress bar
- ✅ **Token Invalidation**: Automatic cleanup of old tokens
- ✅ **Rate Limiting**: Protection against abuse and spam
- ✅ **Secure Sessions**: HttpOnly cookies with automatic refresh

### 📊 Database Migration (if upgrading from JSON)

If you have existing JSON data, run the migration script:

```bash
cd backend
npm run migrate-data migrate
```

**Migration Features:**
- ✅ **Automatic User Creation**: Creates default user for legacy data
- ✅ **Data Preservation**: Migrates all filaments and notes
- ✅ **Backup Creation**: Automatically backs up original JSON files
- ✅ **Validation**: Built-in validation to ensure migration success
- ✅ **Error Handling**: Graceful handling of duplicate or invalid data

**Migration Commands:**
```bash
# Migrate data from JSON files
npm run migrate-data migrate

# Validate migration results
npm run migrate-data validate
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
- `POST /api/auth/verify-code` - Verify 6-digit code manually
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
- `GET /api/notes/:id` - Get note by ID
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

## 🔐 Authentication Flow

### Magic Link Authentication

1. **Login Request**: User enters email address
2. **Email Sent**: System sends magic link + 6-digit code to email
3. **Two Options**:
   - **Option A**: Click magic link in email (automatic login)
   - **Option B**: Enter 6-digit code manually with 15-minute timer
4. **Session Created**: JWT tokens with automatic refresh
5. **Data Access**: User can access their private filament and notes data

### Code Entry Screen Features

- ⏱️ **15-minute Timer**: Visual countdown with progress bar
- 🔢 **6-digit Code**: Monospace input with automatic formatting
- 🔄 **Resend Option**: Request new code if expired
- ⚠️ **Expiration Handling**: Clear messaging when code expires
- 🔙 **Back to Login**: Easy return to email entry

### Security Features

- 🚫 **Token Invalidation**: Old tokens automatically invalidated
- 🛡️ **Rate Limiting**: Protection against spam and abuse
- 🍪 **Secure Cookies**: HttpOnly cookies with automatic refresh
- 🔒 **Data Isolation**: Complete separation between user data

## 🍪 Cookie Consent & GDPR Compliance

Filamentory includes a comprehensive cookie consent system that complies with GDPR regulations:

### Cookie Categories

- **Essential Cookies**: Required for basic functionality (always active)
- **Analytics Cookies**: Help improve the application (optional)
- **Marketing Cookies**: Used for targeted advertising (optional)

### Features

- 🎨 **Beautiful UI**: Gradient banner with clear messaging
- ⚙️ **Granular Control**: Individual toggles for each cookie category
- 💾 **Persistent Storage**: Remembers user preferences
- 🔄 **Easy Updates**: Users can change preferences anytime
- 📱 **Mobile Friendly**: Responsive design for all devices

### Implementation

The cookie consent system is automatically initialized when users first visit the site and provides:

- Clear explanation of what each cookie type does
- Easy-to-use toggle switches for preferences
- Automatic initialization of analytics/marketing tools based on consent
- Persistent storage of user choices

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

**Note**: For Home Assistant integration, you'll need to:
1. Get an access token from the Filamentory API
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
  email_verified: number;
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
  category: string;
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
- And many more...

## 🎨 Supported Filament Types

- **PLA** (Polylactic Acid)
- **PETG** (Polyethylene Terephthalate Glycol)
- **ABS** (Acrylonitrile Butadiene Styrene)
- **TPU** (Thermoplastic Polyurethane)
- **ASA** (Acrylonitrile Styrene Acrylate)
- **PC** (Polycarbonate)
- **Nylon**
- **Wood-filled**
- **Carbon Fiber-filled**
- **Glass Fiber-filled**
- **Metal-filled**
- **Glow-in-the-dark**
- **Silk**
- **Matte**
- **Transparent**

## 🔧 Development

### Project Structure

```
filamentory/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth, Cookie Consent)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── scripts/         # Migration and utility scripts
│   │   └── types/           # TypeScript type definitions
│   └── data/                # SQLite database and backups
└── README.md
```

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

**Backend:**
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run migrate-data # Run data migration script
```

### Environment Variables

**Backend (.env):**
```env
# Email Service
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
APP_URL=http://localhost:3000

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

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Database Schema

The application uses SQLite with the following tables:

- **users**: User accounts and authentication
- **filaments**: Filament inventory (user-specific)
- **notes**: User notes and tips (user-specific)
- **magic_tokens**: Magic link tokens for authentication
- **sessions**: User sessions and refresh tokens
- **cookie_consents**: GDPR cookie consent preferences

### Authentication Flow

1. **Login Request**: User enters email → system generates magic token
2. **Email Sent**: Magic link + 6-digit code sent via Resend
3. **Token Verification**: User clicks link OR enters code
4. **Session Creation**: JWT tokens created and stored in HttpOnly cookies
5. **Data Access**: User can access their private data

### Multi-User Architecture

- **Data Isolation**: All data is filtered by `user_id`
- **Authentication**: JWT-based with automatic refresh
- **Session Management**: Secure cookie-based sessions
- **Rate Limiting**: Per-user rate limiting for security

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ on your server
- Domain name with SSL certificate
- Resend account with verified domain
- Database backup strategy

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure proper CORS origins
- [ ] Set up SSL certificates
- [ ] Configure domain for cookies
- [ ] Set up email domain verification
- [ ] Configure rate limiting for production
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Test authentication flow
- [ ] Test email delivery
- [ ] Test multi-user functionality

### Production Environment Variables

```env
# Production settings
NODE_ENV=production
APP_URL=https://yourdomain.com
COOKIE_DOMAIN=yourdomain.com

# Strong secrets (generate new ones)
JWT_SECRET=your-very-strong-production-secret
RESEND_API_KEY=re_your_production_api_key
FROM_EMAIL=noreply@yourdomain.com

# Production rate limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5
```

### Cost Estimation

**Monthly costs for a small deployment:**
- **Resend**: $20/month (50,000 emails)
- **VPS/Server**: $5-20/month
- **Domain**: $10-15/year
- **SSL Certificate**: Free (Let's Encrypt)

**Total**: ~$25-40/month

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Material-UI components consistently
- Write tests for new features
- Update documentation for API changes
- Follow the existing code style
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **Resend** for reliable email delivery
- **React** and **Node.js** communities for excellent documentation
- **3D Printing Community** for inspiration and feedback

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/filamentory/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/filamentory/discussions)
- **Email**: support@filamentory.com

---

**Happy Printing! 🖨️**

Made with ❤️ for the 3D printing community
