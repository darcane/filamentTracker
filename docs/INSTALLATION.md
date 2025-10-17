# 🚀 Installation Guide

## Prerequisites

- Node.js 18+ and npm
- Resend account for email service

## Quick Installation

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

## Email Service Setup

1. **Sign up for Resend**: Create an account at [resend.com](https://resend.com)
2. **Get API Key**: Generate an API key from your Resend dashboard
3. **Configure Email**: Add your API key to the `.env` file
4. **Test Email**: Use Resend's test domain for development


## Troubleshooting

### Common Issues

1. **Email not sending**: Check your Resend API key and domain verification
2. **Database errors**: Ensure the data directory exists and is writable
3. **Port conflicts**: Make sure ports 3000 and 5000 are available
4. **CORS errors**: Verify your frontend URL matches the CORS configuration

### Getting Help

- Check the [API Documentation](API.md) for endpoint details
- Review the [Authentication Guide](AUTHENTICATION.md) for login issues
- See [Development Guide](DEVELOPMENT.md) for advanced setup
