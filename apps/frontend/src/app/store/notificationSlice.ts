import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  open: boolean;
}

const initialState: NotificationState = {
  message: '',
  severity: 'info',
  open: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(
      state,
      action: PayloadAction<{ message: string; severity: 'success' | 'info' | 'warning' | 'error' }>,
    ) {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.open = true;
    },
    hideNotification(state) {
      state.open = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
