import { Box, Typography, Paper } from '@mui/material';

const Dispatch = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dispatch Center
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography>
          The dispatch center is under construction. Check back later for real-time dispatch management.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dispatch;
