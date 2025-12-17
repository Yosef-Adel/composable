import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from '../features/home/pages/HomePage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { AuthPage } from '../features/auth/pages/AuthPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'stacks',
        element: <div>Stacks - Coming Soon</div>,
      },
      {
        path: 'services',
        element: <div>Services - Coming Soon</div>,
      },
      {
        path: 'templates',
        element: <div>Templates - Coming Soon</div>,
      },
      {
        path: 'deployments',
        element: <div>Deployments - Coming Soon</div>,
      },
      {
        path: 'secrets',
        element: <div>Secrets - Coming Soon</div>,
      },
    ],
  },
]);
