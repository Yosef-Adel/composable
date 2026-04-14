import { Box, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { useState } from 'react';
import type { AuthMode, AuthFormData, AuthErrors } from '../types';

interface AuthFormProps {
  mode: AuthMode;
  formData: AuthFormData;
  errors: AuthErrors;
  isLoading: boolean;
  onFormChange: (data: Partial<AuthFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthForm({
  mode,
  formData,
  errors,
  isLoading,
  onFormChange,
  onSubmit,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mode === 'signup' && (
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'grey.300' }}>
              <Iconify icon="solar:user-bold" width={16} sx={{ mr: 1, verticalAlign: 'middle' }} />
              Full Name
            </Typography>
            <TextField
              fullWidth
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="John Doe"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(15, 23, 42, 0.5)',
                  '& fieldset': {
                    borderColor: errors.name ? 'error.main' : 'grey.700',
                  },
                },
              }}
            />
          </Box>
        )}

        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'grey.300' }}>
            <Iconify icon="solar:letter-bold" width={16} sx={{ mr: 1, verticalAlign: 'middle' }} />
            Email Address
          </Typography>
          <TextField
            fullWidth
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange({ email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="you@example.com"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(15, 23, 42, 0.5)',
                '& fieldset': {
                  borderColor: errors.email ? 'error.main' : 'grey.700',
                },
              },
            }}
          />
        </Box>

        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'grey.300' }}>
            <Iconify icon="solar:lock-password-bold" width={16} sx={{ mr: 1, verticalAlign: 'middle' }} />
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onFormChange({ password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
            placeholder="••••••••"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                  >
                    <Iconify
                      icon={showPassword ? 'solar:eye-closed-bold' : 'solar:eye-bold'}
                      width={20}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(15, 23, 42, 0.5)',
                '& fieldset': {
                  borderColor: errors.password ? 'error.main' : 'grey.700',
                },
              },
            }}
          />
        </Box>

        {mode === 'signup' && (
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'grey.300' }}>
              <Iconify icon="solar:lock-password-bold" width={16} sx={{ mr: 1, verticalAlign: 'middle' }} />
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => onFormChange({ confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              placeholder="••••••••"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(15, 23, 42, 0.5)',
                  '& fieldset': {
                    borderColor: errors.confirmPassword ? 'error.main' : 'grey.700',
                  },
                },
              }}
            />
          </Box>
        )}

        {mode === 'login' && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              sx={{
                color: 'primary.light',
                textTransform: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Forgot password?
            </Button>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            py: 1.5,
            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
            '&:hover': {
              background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3)',
            },
          }}
        >
          {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>

        {/* Terms */}
        {mode === 'signup' && (
          <Typography variant="caption" sx={{ textAlign: 'center', color: 'grey.500', mt: 1 }}>
            By signing up, you agree to our{' '}
            <Typography
              component="a"
              href="#"
              variant="caption"
              sx={{ color: 'primary.light', '&:hover': { color: 'primary.main' } }}
            >
              Terms of Service
            </Typography>{' '}
            and{' '}
            <Typography
              component="a"
              href="#"
              variant="caption"
              sx={{ color: 'primary.light', '&:hover': { color: 'primary.main' } }}
            >
              Privacy Policy
            </Typography>
          </Typography>
        )}
      </Box>
    </form>
  );
}
