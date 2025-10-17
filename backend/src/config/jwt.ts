import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
};

export const COOKIE_CONFIG = {
  domain: process.env.COOKIE_DOMAIN || 'localhost',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  httpOnly: true,
  accessTokenMaxAge: 15 * 60 * 1000, // 15 minutes
  refreshTokenMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};
