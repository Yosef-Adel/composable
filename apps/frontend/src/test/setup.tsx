import '@testing-library/jest-dom/vitest';

// Mock Iconify component used throughout the app
vi.mock('@composable/ui-kit', () => ({
  Iconify: ({ icon, ...props }: any) => <span data-testid={`icon-${icon}`} {...props} />,
}));

// Mock react-router-dom navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
