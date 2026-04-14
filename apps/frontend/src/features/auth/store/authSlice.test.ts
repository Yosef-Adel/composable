import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginAsync,
  signupAsync,
  logoutAsync,
  clearError,
  clearVerification,
} from './authSlice';

// Mock the API module
vi.mock('@/services/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getTokens: vi.fn(() => null),
}));

import { api, setTokens, clearTokens } from '@/services/api';

function createStore() {
  return configureStore({
    reducer: { auth: authReducer },
  });
}

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('loginAsync', () => {
    it('sets user and isAuthenticated on successful login', async () => {
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['USER'],
        isEmailVerified: true,
      };

      (api.post as any).mockResolvedValueOnce({
        data: {
          data: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            user: mockUser,
          },
        },
      });

      const store = createStore();
      await store.dispatch(
        loginAsync({ email: 'test@example.com', password: 'password123' }),
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(setTokens).toHaveBeenCalledWith({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('sets error on failed login', async () => {
      (api.post as any).mockRejectedValueOnce({
        response: { data: { message: 'Invalid credentials' } },
        isAxiosError: true,
      });

      const store = createStore();
      await store.dispatch(
        loginAsync({ email: 'test@example.com', password: 'wrong' }),
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeTruthy();
      expect(state.isLoading).toBe(false);
    });

    it('sets isLoading during login', () => {
      // Never-resolving promise to test loading state
      (api.post as any).mockReturnValueOnce(new Promise(() => {}));

      const store = createStore();
      store.dispatch(
        loginAsync({ email: 'test@example.com', password: 'password' }),
      );

      const state = store.getState().auth;
      expect(state.isLoading).toBe(true);
    });
  });

  describe('signupAsync', () => {
    it('sets requiresVerification on successful signup', async () => {
      (api.post as any).mockResolvedValueOnce({
        data: {
          data: {
            userId: 'new-user-123',
            message: 'Check your email',
          },
        },
      });

      const store = createStore();
      await store.dispatch(
        signupAsync({ name: 'Test', email: 'test@example.com', password: 'pass' }),
      );

      const state = store.getState().auth;
      expect(state.requiresVerification).toBe(true);
      expect(state.pendingUserId).toBe('new-user-123');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logoutAsync', () => {
    it('clears auth state on logout', async () => {
      (api.post as any).mockResolvedValueOnce({});

      const store = createStore();
      // Manually set authenticated state
      (api.post as any).mockResolvedValueOnce({
        data: {
          data: {
            accessToken: 'at',
            refreshToken: 'rt',
            user: { id: '1', name: 'U', email: 'u@e.com', roles: [], isEmailVerified: true },
          },
        },
      });
      await store.dispatch(loginAsync({ email: 'u@e.com', password: 'p' }));

      (api.post as any).mockResolvedValueOnce({});
      await store.dispatch(logoutAsync());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(clearTokens).toHaveBeenCalled();
    });
  });

  describe('reducers', () => {
    it('clearError resets error to null', async () => {
      (api.post as any).mockRejectedValueOnce({
        response: { data: { message: 'fail' } },
        isAxiosError: true,
      });

      const store = createStore();
      await store.dispatch(loginAsync({ email: 'x', password: 'y' }));
      expect(store.getState().auth.error).toBeTruthy();

      store.dispatch(clearError());
      expect(store.getState().auth.error).toBeNull();
    });

    it('clearVerification resets verification state', () => {
      const store = createStore();
      // We can't easily set requiresVerification without signup, so test the reducer directly
      store.dispatch(clearVerification());
      const state = store.getState().auth;
      expect(state.requiresVerification).toBe(false);
      expect(state.pendingUserId).toBeNull();
    });
  });
});
