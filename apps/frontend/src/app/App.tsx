import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@composable/ui-kit/theme';
import { store } from './store';
import { router } from './router';
import { NotificationSnackbar } from './components/NotificationSnackbar';
import { useAppSelector } from './hooks';

function AppInner() {
  const themeMode = useAppSelector((state) => state.theme.mode);
  return (
    <ThemeProvider forcedMode={themeMode}>
      <RouterProvider router={router} />
      <NotificationSnackbar />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
