export interface User {
  id: string;
  email: string;
  email_verified: number;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface MagicToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: number;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
  last_used: string;
}

export interface LoginRequest {
  email: string;
  rememberMe?: boolean;
}

export interface VerifyTokenRequest {
  token: string;
  rememberMe?: boolean;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface CookieConsent {
  id: string;
  user_id: string | null;
  analytics_consent: number;
  marketing_consent: number;
  preferences_consent: number;
  ip_address: string | null;
  user_agent: string | null;
  consent_version: string;
  created_at: string;
  updated_at: string;
}

export interface CookieConsentRequest {
  analytics_consent: boolean;
  marketing_consent: boolean;
  preferences_consent: boolean;
  ip_address?: string;
  user_agent?: string;
}
