import { databaseService } from './database';
import { tokenService } from './tokenService';
import { emailService } from './emailService';
import { EMAIL_CONFIG } from '../config/email';
import { User, LoginRequest, VerifyTokenRequest, AuthResponse } from '../types/auth';
import validator from 'validator';

export class AuthService {
  async requestLogin(loginData: LoginRequest, ipAddress?: string): Promise<{ message: string; email: string }> {
    const { email } = loginData;

    // Validate email
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email address');
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists, create if not
    let user = await databaseService.getUserByEmail(normalizedEmail);
    if (!user) {
      user = await databaseService.createUser(normalizedEmail);
    }

    // Invalidate any existing magic tokens for this user
    await databaseService.invalidateUserMagicTokens(user.id);

    // Generate magic token
    const magicToken = tokenService.generateMagicToken();
    const expiresAt = tokenService.getTokenExpiry(15); // 15 minutes

    // Store magic token in database
    await databaseService.createMagicToken(user.id, magicToken, expiresAt);

    // Generate magic link
    const magicLink = `${EMAIL_CONFIG.appUrl}/auth/verify?token=${magicToken}`;

    // Send magic link email
    const code = magicToken.split('-')[0];
    await emailService.sendMagicLink(normalizedEmail, magicLink, code);

    return {
      message: 'Magic link sent to your email',
      email: normalizedEmail,
      code: code, // Return the 6-digit code for manual entry
    };
  }

  async verifyToken(verifyData: VerifyTokenRequest): Promise<AuthResponse> {
    const { token } = verifyData;

    // Get magic token from database
    const magicTokenRecord = await databaseService.getMagicToken(token);
    if (!magicTokenRecord) {
      throw new Error('Invalid or expired token');
    }

    // Check if token is expired
    if (tokenService.isTokenExpired(magicTokenRecord.expires_at)) {
      throw new Error('Token has expired');
    }

    // Mark token as used
    await databaseService.markMagicTokenAsUsed(magicTokenRecord.id);

    // Get user
    const user = await databaseService.getUserById(magicTokenRecord.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Update last login
    await databaseService.updateUserLastLogin(user.id);

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user.id, user.email);
    const refreshToken = tokenService.generateRefreshToken(user.id, 'session-id'); // We'll use session management later

    // Create session
    const sessionExpiry = tokenService.getTokenExpiry(30 * 24 * 60); // 30 days
    await databaseService.createSession(user.id, refreshToken, sessionExpiry);

    // Send welcome email for new users (optional)
    if (user.email_verified === 0) {
      emailService.sendWelcomeEmail(user.email);
    }

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async verifyCode(email: string, code: string): Promise<AuthResponse> {
    // Find the user
    const user = await databaseService.getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('User not found');
    }

    // Find a valid magic token for this user that starts with the code
    const magicTokenRecord = await databaseService.getMagicTokenByUserAndCode(user.id, code);
    if (!magicTokenRecord) {
      throw new Error('Invalid or expired code');
    }

    // Check if token is expired
    if (tokenService.isTokenExpired(magicTokenRecord.expires_at)) {
      throw new Error('Code has expired');
    }

    // Mark token as used
    await databaseService.markMagicTokenAsUsed(magicTokenRecord.id);

    // Update last login
    await databaseService.updateUserLastLogin(user.id);

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user.id, user.email);
    const refreshToken = tokenService.generateRefreshToken(user.id, 'session-id');

    // Create session
    const sessionExpiry = tokenService.getTokenExpiry(30 * 24 * 60); // 30 days
    await databaseService.createSession(user.id, refreshToken, sessionExpiry);

    // Send welcome email for new users (optional)
    if (user.email_verified === 0) {
      emailService.sendWelcomeEmail(user.email);
    }

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    // Get session from database
    const session = await databaseService.getSessionByRefreshToken(refreshToken);
    if (!session) {
      throw new Error('Session not found');
    }

    // Check if session is expired
    if (tokenService.isTokenExpired(session.expires_at)) {
      throw new Error('Session has expired');
    }

    // Get user
    const user = await databaseService.getUserById(session.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Update session last used
    await databaseService.updateSessionLastUsed(session.id);

    // Generate new tokens
    const newAccessToken = tokenService.generateAccessToken(user.id, user.email);
    const newRefreshToken = tokenService.generateRefreshToken(user.id, session.id);

    // Update session with new refresh token
    const sessionExpiry = tokenService.getTokenExpiry(30 * 24 * 60); // 30 days
    await databaseService.deleteSession(session.id);
    await databaseService.createSession(user.id, newRefreshToken, sessionExpiry);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    // Get session from database
    const session = await databaseService.getSessionByRefreshToken(refreshToken);
    if (session) {
      // Delete session
      await databaseService.deleteSession(session.id);
    }
  }

  async getUserFromToken(accessToken: string): Promise<User | null> {
    const payload = tokenService.verifyAccessToken(accessToken);
    if (!payload) {
      return null;
    }

    return await databaseService.getUserById(payload.userId);
  }
}

export const authService = new AuthService();
