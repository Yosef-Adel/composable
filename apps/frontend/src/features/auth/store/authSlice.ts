import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, setTokens, clearTokens, getTokens } from '@/services/api';
import { AxiosError } from 'axios';
import type { AuthState, User, LoginCredentials, SignupCredentials } from '../types';

const USER_STORAGE_KEY = 'composable_user';

function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data?.data?.message) {
      return Array.isArray(data.data.message) ? data.data.message[0] : data.data.message;
    }
    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message;
    }
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

// Thunks
export const loginAsync = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken, user } = data.data;
    setTokens({ accessToken, refreshToken });
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user as User;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const signupAsync = createAsyncThunk<
  { userId: string; message: string; email: string },
  Omit<SignupCredentials, 'confirmPassword'>,
  { rejectValue: string; dispatch: any }
>('auth/signup', async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await api.post('/auth/register', credentials);
    const result = { ...(data.data as { userId: string; message: string }), email: credentials.email };
    // Auto-login after signup (backend auto-verifies when SMTP is not configured)
    dispatch(loginAsync({ email: credentials.email, password: credentials.password }));
    return result;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const verifyOtpAsync = createAsyncThunk<
  { message: string },
  { userId: string; otp: string },
  { rejectValue: string }
>('auth/verifyOtp', async ({ userId, otp }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/verify-email', { userId, otp });
    return data.data as { message: string };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const resendOtpAsync = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>('auth/resendOtp', async ({ email }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/resend-otp', { email });
    return data.data as { message: string };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const logoutAsync = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout locally even if API fails
    } finally {
      clearTokens();
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },
);

export const validateSession = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/validateSession', async (_, { rejectWithValue }) => {
  const tokens = getTokens();
  if (!tokens?.accessToken) {
    return rejectWithValue('No token');
  }
  try {
    const { data } = await api.get('/auth/me');
    const user = data.data as User;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    clearTokens();
    localStorage.removeItem(USER_STORAGE_KEY);
    return rejectWithValue(extractErrorMessage(error));
  }
});

const storedUser = loadUserFromStorage();
const hasTokens = !!getTokens()?.accessToken;

const initialState: AuthState = {
  user: hasTokens ? storedUser : null,
  isAuthenticated: hasTokens && !!storedUser,
  isLoading: false,
  error: null,
  requiresVerification: false,
  pendingUserId: null,
  pendingEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearVerification(state) {
      state.requiresVerification = false;
      state.pendingUserId = null;
      state.pendingEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed';
      })
      // Signup
      .addCase(signupAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Don't set requiresVerification — auto-login is dispatched
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Signup failed';
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      // Validate session
      .addCase(validateSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(validateSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Verify OTP
      .addCase(verifyOtpAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.requiresVerification = false;
        state.pendingUserId = null;
        state.pendingEmail = null;
        state.error = null;
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Verification failed';
      })
      // Resend OTP
      .addCase(resendOtpAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOtpAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendOtpAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to resend code';
      });
  },
});

export const { clearError, clearVerification } = authSlice.actions;
export default authSlice.reducer;

