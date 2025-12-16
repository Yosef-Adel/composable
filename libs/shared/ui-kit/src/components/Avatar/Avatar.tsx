import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, AvatarGroup as MuiAvatarGroup, AvatarGroupProps as MuiAvatarGroupProps } from '@mui/material';

export interface AvatarProps extends MuiAvatarProps {
  // Add any custom props here
}

export interface AvatarGroupProps extends MuiAvatarGroupProps {
  // Add any custom props here
}

/**
 * Custom Avatar component built on MUI Avatar
 */
export function Avatar(props: AvatarProps) {
  return <MuiAvatar {...props} />;
}

/**
 * Custom AvatarGroup component
 */
export function AvatarGroup(props: AvatarGroupProps) {
  return <MuiAvatarGroup {...props} />;
}
