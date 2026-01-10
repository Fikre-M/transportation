import { Box, Typography, Paper, useTheme } from '@mui/material';

const MapLegend = ({ position = 'bottom-left', items = [] }) => {
  const theme = useTheme();
  
  const positionStyles = {
    position: 'absolute',
    ...(position === 'bottom-left' && { bottom: 16, left: 16 }),
    ...(position === 'bottom-right' && { bottom: 16, right: 16 }),
    ...(position === 'top-left' && { top: 16, left: 16 }),
    ...(position === 'top-right' && { top: 16, right: 16 }),
  };

  return (
    <Paper 
      sx={{ 
        p: 1.5, 
        borderRadius: 1,
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        ...positionStyles,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Legend
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                backgroundColor: item.color,
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.1)'
              }} 
            />
            <Typography variant="body2">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default MapLegend;
