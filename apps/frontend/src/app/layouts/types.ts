import type { SxProps, Theme } from '@mui/material/styles';

export type NavItemBase = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItemBase[];
};

export type NavSectionData = {
  subheader?: string;
  items: NavItemBase[];
};

export type NavSectionProps = {
  data: NavSectionData[];
  sx?: SxProps<Theme>;
};
