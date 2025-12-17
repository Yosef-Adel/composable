import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/home/pages/HomePage';
import { AuthPage } from '../features/auth/pages/AuthPage';
import { ProjectsPage } from '../features/projects/pages/ProjectsPage';
import { DashboardPage } from '../features/composer/pages/DashboardPage';
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
    path: '/projects',
    element: (
      <ProtectedRoute>
        <ProjectsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/:projectId',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);
