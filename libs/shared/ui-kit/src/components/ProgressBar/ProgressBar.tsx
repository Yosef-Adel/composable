import './styles.css';
import NProgress from 'nprogress';
import { useState, useEffect } from 'react';

export type ProgressBarProps = {
  /**
   * Color of the progress bar (CSS variable or hex/rgb)
   */
  color?: string;
  /**
   * Height of the progress bar in pixels
   */
  height?: number;
  /**
   * Options for NProgress
   */
  options?: {
    minimum?: number;
    easing?: string;
    speed?: number;
    trickle?: boolean;
    trickleSpeed?: number;
    showSpinner?: boolean;
  };
};

export function ProgressBar({ color, height = 2.5, options }: ProgressBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      ...options,
    });

    // Apply custom styles
    if (color || height !== 2.5) {
      const style = document.createElement('style');
      style.innerHTML = `
        ${color ? `
          #nprogress .bar {
            background-color: ${color} !important;
            box-shadow: 0 0 2.5px ${color} !important;
          }
          #nprogress .peg {
            box-shadow: 0 0 10px ${color}, 0 0 5px ${color} !important;
          }
        ` : ''}
        ${height !== 2.5 ? `
          #nprogress {
            height: ${height}px !important;
          }
        ` : ''}
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [mounted, color, height, options]);

  if (!mounted) {
    return null;
  }

  return null;
}

// Export NProgress methods for manual control
export const progressBar = {
  start: () => NProgress.start(),
  done: () => NProgress.done(),
  set: (n: number) => NProgress.set(n),
  inc: (amount?: number) => NProgress.inc(amount),
  configure: (options: Parameters<typeof NProgress.configure>[0]) => NProgress.configure(options),
};
