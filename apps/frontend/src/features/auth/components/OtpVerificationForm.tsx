import { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { verifyOtpAsync, resendOtpAsync, clearError, clearVerification } from '../store/authSlice';

const OTP_LENGTH = 6;

export function OtpVerificationForm() {
  const dispatch = useAppDispatch();
  const { isLoading, error, pendingUserId, pendingEmail } = useAppSelector(
    (state) => state.auth,
  );
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];

    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, OTP_LENGTH).split('');
      pasted.forEach((d, i) => {
        if (index + i < OTP_LENGTH) newDigits[index + i] = d;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(index + pasted.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newDigits[index] = value;
      setDigits(newDigits);
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== OTP_LENGTH || !pendingUserId) return;

    dispatch(clearError());
    const result = await dispatch(verifyOtpAsync({ userId: pendingUserId, otp }));
    if (verifyOtpAsync.fulfilled.match(result)) {
      setVerified(true);
    }
  };

  const handleResend = () => {
    if (!pendingEmail || resendCooldown > 0) return;
    dispatch(resendOtpAsync({ email: pendingEmail }));
    setResendCooldown(60);
  };

  const handleBackToLogin = () => {
    dispatch(clearVerification());
    dispatch(clearError());
  };

  const otp = digits.join('');
  const isComplete = otp.length === OTP_LENGTH;

  if (verified) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Iconify
          icon="solar:check-circle-bold"
          width={64}
          sx={{ color: 'success.main', mb: 2 }}
        />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Email Verified!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your account is ready. You can now sign in.
        </Typography>
        <Button variant="contained" fullWidth onClick={handleBackToLogin}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Iconify
          icon="solar:letter-bold"
          width={48}
          sx={{ color: 'primary.main', mb: 1 }}
        />
        <Typography variant="h6">Verify Your Email</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Enter the 6-digit code sent to{' '}
          <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: 'primary.light' }}>
            {pendingEmail}
          </Typography>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Check server logs if SMTP is not configured
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
        {digits.map((digit, i) => (
          <TextField
            key={i}
            inputRef={(el) => { inputRefs.current[i] = el; }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputProps={{
              maxLength: i === 0 ? OTP_LENGTH : 1,
              style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, padding: '12px 0' },
              inputMode: 'numeric',
            }}
            sx={{
              width: 48,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(15, 23, 42, 0.5)',
                '& fieldset': { borderColor: digit ? 'primary.main' : 'grey.700' },
              },
            }}
          />
        ))}
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={!isComplete || isLoading}
        sx={{
          py: 1.5,
          mb: 2,
          background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
          },
        }}
      >
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          size="small"
          onClick={handleBackToLogin}
          sx={{ color: 'grey.400', textTransform: 'none' }}
        >
          ← Back to login
        </Button>
        <Button
          size="small"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isLoading}
          sx={{ color: 'primary.light', textTransform: 'none' }}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
        </Button>
      </Box>
    </form>
  );
}
