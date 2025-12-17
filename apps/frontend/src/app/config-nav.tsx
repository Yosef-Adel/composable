import { Iconify } from '@composable/ui-kit';
import type { NavSectionData } from './layouts/types';

export const navConfig: NavSectionData[] = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Iconify icon="solar:home-bold-duotone" width={24} />,
      },
    ],
  },
  {
    subheader: 'Build',
    items: [
      {
        title: 'Stacks',
        path: '/stacks',
        icon: <Iconify icon="solar:layers-bold-duotone" width={24} />,
      },
      {
        title: 'Services',
        path: '/services',
        icon: <Iconify icon="solar:server-bold-duotone" width={24} />,
      },
      {
        title: 'Templates',
        path: '/templates',
        icon: <Iconify icon="solar:document-bold-duotone" width={24} />,
      },
    ],
  },
  {
    subheader: 'Deploy',
    items: [
      {
        title: 'Deployments',
        path: '/deployments',
        icon: <Iconify icon="solar:rocket-bold-duotone" width={24} />,
      },
      {
        title: 'Secrets',
        path: '/secrets',
        icon: <Iconify icon="solar:lock-keyhole-bold-duotone" width={24} />,
      },
    ],
  },
];
