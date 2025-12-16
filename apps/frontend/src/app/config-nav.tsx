import {
  Home,
  Inventory,
  ShoppingCart,
  Assessment,
  Category,
  LocalShipping,
} from '@mui/icons-material';
import type { NavSectionData } from './layouts/types';

export const navConfig: NavSectionData[] = [
  {
    subheader: 'General',
    items: [
      {
        title: 'Home',
        path: '/',
        icon: <Home />,
      },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Items',
        path: '/items',
        icon: <Category />,
      },
      {
        title: 'Inventory',
        path: '/inventory',
        icon: <Inventory />,
      },
      {
        title: 'Sales',
        path: '/sales',
        icon: <ShoppingCart />,
      },
      {
        title: 'Purchases',
        path: '/purchases',
        icon: <LocalShipping />,
      },
    ],
  },
  {
    subheader: 'Analytics',
    items: [
      {
        title: 'Reports',
        path: '/reports',
        icon: <Assessment />,
      },
    ],
  },
];
