export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isEmailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresVerification: boolean;
  pendingUserId: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type AuthMode = 'login' | 'signup';

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
