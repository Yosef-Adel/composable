import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loginAsync, signupAsync, clearError, validateSession } from '../store/authSlice';
import { AuthBackground } from '../components/AuthBackground';
import { AuthHeader } from '../components/AuthHeader';
import { AuthModeToggle } from '../components/AuthModeToggle';
import { AuthForm } from '../components/AuthForm';
import { useAuthForm } from '../hooks/useAuthForm';
import type { AuthMode } from '../types';

export function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth,
  );
  const [mode, setMode] = useState<AuthMode>('login');
  const { formData, errors, validateForm, updateFormData, resetForm } = useAuthForm(mode);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
    dispatch(clearError());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (mode === 'login') {
      dispatch(
        loginAsync({
          email: formData.email,
          password: formData.password,
        }),
      );
    } else {
      dispatch(
        signupAsync({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      );
    }
  };

  // Navigate when auth succeeds
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects');
    }
  }, [isAuthenticated, navigate]);

  // Validate existing session on mount
  useEffect(() => {
    dispatch(validateSession());
  }, [dispatch]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AuthBackground />

      <Box sx={{ position: 'relative', width: '100%', maxWidth: 448, zIndex: 1 }}>
        <AuthHeader />

        <Card
          sx={{
            bgcolor: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(16px)',
            border: 1,
            borderColor: 'grey.700',
            borderRadius: 2,
            p: 4,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <AuthModeToggle mode={mode} onModeChange={handleModeChange} />

          {error && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'error.main',
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    border: 1,
                    borderColor: 'error.dark',
                    borderRadius: 1,
                    p: 1.5,
                    cursor: 'pointer',
                  }}
                  onClick={() => dispatch(clearError())}
                >
                  {error}
                </Typography>
              </Box>
            )}

            <AuthForm
              mode={mode}
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              onFormChange={updateFormData}
              onSubmit={handleSubmit}
            />
        </Card>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: 'grey.500',
            mt: 3,
          }}
        >
          © 2024 Composable. Built for developers, by developers.
        </Typography>
      </Box>
    </Box>
  );
}
