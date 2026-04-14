import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useLocation } from 'react-router-dom';
import type { NavItemBase } from '../types';

interface NavItemProps {
  item: NavItemBase;
  depth?: number;
}

export const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  ({ item, depth = 0 }, ref) => {
    const location = useLocation();
    const active = location.pathname === item.path;

    return (
      <ListItemButton
        ref={ref}
        component={Link as any}
        to={item.path}
        sx={{
          pl: 2 + depth * 2,
          borderRadius: 1,
          mb: 0.5,
          color: 'text.secondary',
          ...(active && {
            color: 'primary.main',
            bgcolor: 'action.selected',
            fontWeight: 'fontWeightSemiBold',
          }),
        }}
      >
        {item.icon && <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>}
        <ListItemText primary={item.title} />
      </ListItemButton>
    );
  }
);

NavItem.displayName = 'NavItem';
