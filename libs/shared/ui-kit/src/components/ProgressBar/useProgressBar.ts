import { useEffect } from 'react';
import NProgress from 'nprogress';

/**
 * Hook to show progress bar on route changes
 * @param pathname - Current pathname from your router
 * @param enabled - Whether to enable the progress bar
 */
export function useProgressBar(pathname: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    NProgress.start();

    // Done after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, enabled]);
}
