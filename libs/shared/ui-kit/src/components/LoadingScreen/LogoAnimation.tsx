import { keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.95);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export function LogoAnimation() {
  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Outer ring */}
      <Box
        sx={{
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: '50%',
          border: '3px solid',
          borderColor: 'primary.main',
          borderTopColor: 'transparent',
          animation: `${rotate} 1.5s linear infinite`,
        }}
      />
      
      {/* Inner circle */}
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          animation: `${pulse} 1.5s ease-in-out infinite`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.contrastText',
          fontWeight: 'bold',
          fontSize: 24,
        }}
      >
        L
      </Box>
    </Box>
  );
}
