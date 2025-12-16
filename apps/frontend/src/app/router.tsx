import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from '../features/home/pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { 
        index: true, 
        element: <HomePage /> 
      },
      { 
        path: 'items', 
        element: <div>Items Page - Coming Soon</div> 
      },
      { 
        path: 'inventory', 
        element: <div>Inventory Page - Coming Soon</div> 
      },
      { 
        path: 'sales', 
        element: <div>Sales Page - Coming Soon</div> 
      },
      { 
        path: 'purchases', 
        element: <div>Purchases Page - Coming Soon</div> 
      },
      { 
        path: 'reports', 
        element: <div>Reports Page - Coming Soon</div> 
      },
    ],
  },
]);
