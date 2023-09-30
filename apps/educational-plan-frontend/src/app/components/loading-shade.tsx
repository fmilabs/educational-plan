import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

interface LoadingShadeProps {
  backdropColor?: string;
  backdropOpacity?: number;
  mode?: 'circular' | 'linear';
}

export default function LoadingShade({ backdropColor = 'background.default', backdropOpacity = 0.5, mode = 'circular' }: LoadingShadeProps) {

  const flexProps = mode === 'circular' ? { justifyContent: 'center', alignItems: 'center' } : {};

  return (
    <Box
      sx={{
        position: 'absolute',
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
      {mode === 'linear' ? <LinearProgress sx={{ flexGrow: 1 }} /> : <CircularProgress />}
    </Box>
  );
}
