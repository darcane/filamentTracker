export interface User {
  id: string;
  email: string;
  email_verified: number;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  isAuthenticated: boolean;
}
