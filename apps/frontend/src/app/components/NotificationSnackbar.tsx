import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { hideNotification } from '@/app/store/notificationSlice';

export function NotificationSnackbar() {
  const dispatch = useAppDispatch();
  const { open, message, severity } = useAppSelector((state) => state.notification);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => dispatch(hideNotification())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => dispatch(hideNotification())}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
