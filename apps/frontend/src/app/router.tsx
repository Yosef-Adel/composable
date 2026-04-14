import { lazy, Suspense } from 'react';
import { createBrowserRouter, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoader } from './components/PageLoader';
import { NotFoundPage } from './pages/NotFoundPage';

const HomePage = lazy(() =>
  import('../features/home/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const AuthPage = lazy(() =>
  import('../features/auth/pages/AuthPage').then((m) => ({ default: m.AuthPage })),
);
const ProjectsPage = lazy(() =>
  import('../features/projects/pages/ProjectsPage').then((m) => ({
    default: m.ProjectsPage,
  })),
);
const DashboardPage = lazy(() =>
  import('../features/composer/pages/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);
const SharedViewPage = lazy(() =>
  import('../features/composer/pages/SharedViewPage').then((m) => ({
    default: m.SharedViewPage,
  })),
);

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth',
    element: (
      <SuspenseWrapper>
        <AuthPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/projects',
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <ProjectsPage />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: '/dashboard/:projectId',
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: '/shared/:token',
    element: (
      <SuspenseWrapper>
        <SharedViewPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
