import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@composable/ui-kit/theme';
import { store } from './store';
import { router } from './router';
import { NotificationSnackbar } from './components/NotificationSnackbar';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <NotificationSnackbar />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
