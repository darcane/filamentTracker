import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWT_CONFIG } from '../config/jwt';
import { JWTPayload, RefreshTokenPayload } from '../types/auth';

export class TokenService {
  generateAccessToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
    };

    return jwt.sign(payload, JWT_CONFIG.secret);
  }

  generateRefreshToken(userId: string, sessionId: string): string {
    const payload: RefreshTokenPayload = {
      userId,
      sessionId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    };

    return jwt.sign(payload, JWT_CONFIG.secret);
  }

  verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_CONFIG.secret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(token, JWT_CONFIG.secret) as RefreshTokenPayload;
    } catch (error) {
      return null;
    }
  }

  generateMagicToken(): string {
    // Generate a 6-digit code + UUID for uniqueness
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const uuid = uuidv4().replace(/-/g, '').substring(0, 8);
    return `${code}-${uuid}`;
  }

  getTokenExpiry(minutes: number = 15): string {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry.toISOString();
  }

  isTokenExpired(expiryDate: string): boolean {
    return new Date(expiryDate) < new Date();
  }
}

export const tokenService = new TokenService();
