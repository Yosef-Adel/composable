import { Card as MuiCard, CardContent, CardHeader, CardProps as MuiCardProps } from '@mui/material';
import { ReactNode } from 'react';

export interface CardProps extends Omit<MuiCardProps, 'title'> {
  /**
   * Card title
   */
  title?: string;
  /**
   * Card content
   */
  children: ReactNode;
}

/**
 * Custom Card component
 */
export function Card({ title, children, ...props }: CardProps) {
  return (
    <MuiCard {...props}>
      {title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
}
