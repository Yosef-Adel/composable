import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginCredentials, SignupCredentials } from '../types';
import { AUTH_STORAGE_KEY, DEMO_USER } from '../constants/storage';

const loadUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
    },
    loginFailure: (state) => {
      state.isLoading = false;
    },
    signupStart: (state) => {
      state.isLoading = true;
    },
    signupSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
    },
    signupFailure: (state) => {
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
    demoLogin: (state) => {
      state.user = DEMO_USER;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  demoLogin,
} = authSlice.actions;

export const login = (credentials: LoginCredentials) => (dispatch: any) => {
  dispatch(loginStart());

  // Simulate authentication (in real app, this would be an API call)
  setTimeout(() => {
    const user: User = {
      email: credentials.email,
      name: credentials.email.split('@')[0],
    };
    dispatch(loginSuccess(user));
  }, 500);
};

export const signup = (credentials: SignupCredentials) => (dispatch: any) => {
  dispatch(signupStart());

  // Simulate registration (in real app, this would be an API call)
  setTimeout(() => {
    const user: User = {
      email: credentials.email,
      name: credentials.name,
    };
    dispatch(signupSuccess(user));
  }, 500);
};

export default authSlice.reducer;
