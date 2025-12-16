/**
 * Example wrapper for React Router
 * This is provided as a reference - users can adapt for their router
 */
import { useEffect } from 'react';
import { ProgressBar, progressBar } from './ProgressBar';

export type RouterProgressBarProps = {
  /**
   * Current pathname from your router
   * e.g., from useLocation() in React Router
   */
  pathname: string;
  /**
   * Color of the progress bar
   */
  color?: string;
  /**
   * Height of the progress bar
   */
  height?: number;
};

export function RouterProgressBar({ pathname, ...props }: RouterProgressBarProps) {
  useEffect(() => {
    progressBar.start();
    
    const timer = setTimeout(() => {
      progressBar.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      progressBar.done();
    };
  }, [pathname]);

  return <ProgressBar {...props} />;
}
