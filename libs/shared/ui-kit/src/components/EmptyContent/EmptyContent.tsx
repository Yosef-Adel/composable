import type { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { varAlpha } from '../../theme/styles';
import { EmptyIllustration } from './illustrations/EmptyIllustration';

export type EmptyContentProps = StackProps & {
  title?: string;
  imgUrl?: string;
  filled?: boolean;
  description?: string;
  action?: React.ReactNode;
  slotProps?: {
    img?: SxProps<Theme>;
    title?: SxProps<Theme>;
    description?: SxProps<Theme>;
  };
};

export function EmptyContent({
  sx,
  imgUrl,
  action,
  filled,
  slotProps,
  description,
  title = 'No data',
  ...other
}: EmptyContentProps) {
  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        px: 3,
        py: 5,
        height: 1,
        ...(filled && {
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${varAlpha(theme.palette.grey['500Channel'], 0.08)}`,
        }),
        ...sx,
      }}
      {...other}
    >
      {imgUrl ? (
        <Box
          component="img"
          alt="empty content"
          src={imgUrl}
          sx={{ 
            width: 1, 
            maxWidth: 160,
            mb: 2,
            ...slotProps?.img 
          }}
        />
      ) : (
        <EmptyIllustration sx={{ mb: 2, ...slotProps?.img }} />
      )}

      {title && (
        <Typography
          variant="h6"
          component="span"
          sx={{ 
            mt: 1, 
            textAlign: 'center', 
            color: 'text.disabled',
            ...slotProps?.title 
          }}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="caption"
          sx={{ 
            mt: 1, 
            textAlign: 'center', 
            color: 'text.disabled',
            ...slotProps?.description 
          }}
        >
          {description}
        </Typography>
      )}

      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Stack>
  );
}
