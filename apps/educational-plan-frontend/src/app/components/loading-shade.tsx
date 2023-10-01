import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

interface LoadingShadeProps {
  backdropColor?: string;
  backdropOpacity?: number;
  mode?: 'circular' | 'linear';
  position?: 'absolute' | 'fixed';
  title?: string;
}

export default function LoadingShade({
  backdropColor = 'background.default',
  backdropOpacity = 0.5,
  mode = 'circular',
  position = 'absolute',
  title,
}: LoadingShadeProps) {

  const flexProps = mode === 'circular'
    ? { justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }
    : {};

  return (
    <Box
      sx={{
        position,
        inset: '0 0 0 0',
        display: 'flex',
        ...flexProps,
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: '0 0 0 0',
          backgroundColor: backdropColor,
          opacity: backdropOpacity,
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {mode === 'linear' ? <LinearProgress sx={{ flexGrow: 1 }} /> : <CircularProgress />}
        {title && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {title}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
