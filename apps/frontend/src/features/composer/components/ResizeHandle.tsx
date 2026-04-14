import { useCallback, useRef } from 'react';
import { Box } from '@mui/material';

interface ResizeHandleProps {
  /** Which side of the panel the handle sits on */
  side: 'left' | 'right';
  /** Current width of the panel */
  width: number;
  /** Callback when width changes */
  onResize: (width: number) => void;
  /** Minimum width in px */
  minWidth?: number;
  /** Maximum width in px */
  maxWidth?: number;
}

export function ResizeHandle({
  side,
  width,
  onResize,
  minWidth = 200,
  maxWidth = 600,
}: ResizeHandleProps) {
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startXRef.current = e.clientX;
      startWidthRef.current = width;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startXRef.current;
        // For a handle on the right side of the panel, dragging right = wider
        // For a handle on the left side, dragging left = wider
        const newWidth =
          side === 'right'
            ? startWidthRef.current + delta
            : startWidthRef.current - delta;
        onResize(Math.min(maxWidth, Math.max(minWidth, newWidth)));
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [width, onResize, side, minWidth, maxWidth],
  );

  return (
    <Box
      onMouseDown={handleMouseDown}
      sx={{
        width: 6,
        cursor: 'col-resize',
        position: 'relative',
        flexShrink: 0,
        zIndex: 10,
        // Invisible hit area, visible indicator on hover
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 2,
          width: 2,
          borderRadius: 1,
          bgcolor: 'transparent',
          transition: 'background-color 0.15s',
        },
        '&:hover::after': {
          bgcolor: 'primary.main',
        },
        '&:active::after': {
          bgcolor: 'primary.light',
        },
      }}
    />
  );
}
