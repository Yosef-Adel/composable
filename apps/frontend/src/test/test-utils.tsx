import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '@/features/auth/store/authSlice';
import projectsReducer from '@/features/projects/store/projectsSlice';
import composerReducer from '@/features/composer/store/composerSlice';

const rootReducer = {
  auth: authReducer,
  projects: projectsReducer,
  composer: composerReducer,
};

export function createTestStore(preloadedState?: Parameters<typeof configureStore>[0]['preloadedState']) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

interface WrapperOptions extends RenderOptions {
  preloadedState?: any;
  route?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, route = '/', ...options }: WrapperOptions = {},
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
