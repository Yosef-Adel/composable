import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import projectsReducer from '@/features/projects/store/projectsSlice';
import composerReducer from '@/features/composer/store/composerSlice';
import notificationReducer from '@/app/store/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    composer: composerReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
