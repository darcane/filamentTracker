import express from 'express';
import { authService } from '../services/authService';
import { authRateLimit, verifyRateLimit, refreshRateLimit } from '../middleware/rateLimiter';
import { authenticateToken } from '../middleware/auth';
import { COOKIE_CONFIG } from '../config/jwt';
import { LoginRequest, VerifyTokenRequest, VerifyCodeRequest } from '../types/auth';

// Helper function to get cookie options based on rememberMe setting
const getCookieOptions = (rememberMe: boolean = true) => ({
  httpOnly: true,
  secure: COOKIE_CONFIG.secure,
  sameSite: COOKIE_CONFIG.sameSite,
  domain: COOKIE_CONFIG.domain,
  // If rememberMe is false, don't set maxAge - cookies will be session cookies
  ...(rememberMe ? { maxAge: COOKIE_CONFIG.accessTokenMaxAge } : {}),
});

const getRefreshCookieOptions = (rememberMe: boolean = true) => ({
  httpOnly: true,
  secure: COOKIE_CONFIG.secure,
  sameSite: COOKIE_CONFIG.sameSite,
  domain: COOKIE_CONFIG.domain,
  path: '/api/auth/refresh',
  // If rememberMe is false, don't set maxAge - cookies will be session cookies
  ...(rememberMe ? { maxAge: COOKIE_CONFIG.refreshTokenMaxAge } : {}),
});

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Request magic link login
 *     description: Send a magic link to the user's email for passwordless authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Magic link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Magic link sent to your email
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *       400:
 *         description: Invalid email address
 *       429:
 *         description: Too many requests
 */
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const loginData: LoginRequest = req.body;
    const ipAddress = req.ip;

    const result = await authService.requestLogin(loginData, ipAddress);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Login failed' });
  }
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify magic link token
 *     description: Verify the magic link token and return authentication tokens
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Magic link token from email
 *       - in: query
 *         name: rememberMe
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: If true, creates persistent cookies (30 days). If false, creates session cookies that expire when browser closes.
 *     responses:
 *       200:
 *         description: Token verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid or expired token
 *       429:
 *         description: Too many requests
 */
router.get('/verify', verifyRateLimit, async (req, res) => {
  try {
    const verifyData: VerifyTokenRequest = { 
      token: req.query.token as string,
      rememberMe: req.query.rememberMe !== 'false', // Default to true
    };

    if (!verifyData.token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const authResponse = await authService.verifyToken(verifyData);
    const rememberMe = verifyData.rememberMe ?? true;

    // Set httpOnly cookies with appropriate expiry based on rememberMe
    res.cookie('access_token', authResponse.accessToken, getCookieOptions(rememberMe));
    res.cookie('refresh_token', authResponse.refreshToken, getRefreshCookieOptions(rememberMe));

    res.json({
      user: authResponse.user,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Token verification failed' });
  }
});

/**
 * @swagger
 * /api/auth/verify-code:
 *   post:
 *     summary: Verify 6-digit code
 *     description: Verify the 6-digit code sent via email and return authentication tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *               rememberMe:
 *                 type: boolean
 *                 default: true
 *                 description: If true, creates persistent cookies (30 days). If false, creates session cookies that expire when browser closes.
 *     responses:
 *       200:
 *         description: Code verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       400:
 *         description: Invalid or expired code
 *       429:
 *         description: Too many requests
 */
router.post('/verify-code', verifyRateLimit, async (req, res) => {
  try {
    const { email, code, rememberMe = true }: VerifyCodeRequest = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Code must be a 6-digit number' });
    }

    const authResponse = await authService.verifyCode(email, code, rememberMe);

    // Set httpOnly cookies with appropriate expiry based on rememberMe
    res.cookie('access_token', authResponse.accessToken, getCookieOptions(rememberMe));
    res.cookie('refresh_token', authResponse.refreshToken, getRefreshCookieOptions(rememberMe));

    res.json({
      user: authResponse.user,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Code verification error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Code verification failed' });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using the refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 *       429:
 *         description: Too many requests
 */
router.post('/refresh', refreshRateLimit, async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const tokens = await authService.refreshToken(refreshToken);

    // Use the rememberMe preference from the original session to maintain consistency
    res.cookie('access_token', tokens.accessToken, getCookieOptions(tokens.rememberMe));
    res.cookie('refresh_token', tokens.refreshToken, getRefreshCookieOptions(tokens.rememberMe));

    res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: error instanceof Error ? error.message : 'Token refresh failed' });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logout user and invalidate refresh token
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Not authenticated
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // Clear cookies
    res.clearCookie('access_token', {
      domain: COOKIE_CONFIG.domain,
      path: '/',
    });

    res.clearCookie('refresh_token', {
      domain: COOKIE_CONFIG.domain,
      path: '/api/auth/refresh',
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get information about the currently authenticated user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

export default router;
