import { Box } from '@mui/material';

export function AuthBackground() {
  return (
    <>
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Gradient blobs */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '25%',
            width: 384,
            height: 384,
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '50%',
            filter: 'blur(96px)',
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '33%',
            right: '25%',
            width: 384,
            height: 384,
            background: 'rgba(168, 85, 247, 0.2)',
            borderRadius: '50%',
            filter: 'blur(96px)',
            animation: 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            left: '33%',
            width: 384,
            height: 384,
            background: 'rgba(6, 182, 212, 0.2)',
            borderRadius: '50%',
            filter: 'blur(96px)',
            animation: 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />

        {/* Grid pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage:
              'radial-gradient(ellipse 80% 50% at 50% 50%, #000 70%, transparent 110%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 50% at 50% 50%, #000 70%, transparent 110%)',
          }}
        />
      </Box>
    </>
  );
}
