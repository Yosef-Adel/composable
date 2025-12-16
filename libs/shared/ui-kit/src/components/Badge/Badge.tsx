import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from '@mui/material';

export interface BadgeProps extends MuiBadgeProps {
  // Add any custom props here
}

/**
 * Custom Badge component built on MUI Badge
 */
export function Badge(props: BadgeProps) {
  return <MuiBadge {...props} />;
}
