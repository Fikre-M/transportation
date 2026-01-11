import { Box, Typography, Paper } from "@mui/material";

const MapView = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Live Map View
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography>Real-time vehicle tracking will appear here.</Typography>
      </Paper>
    </Box>
  );
};

export default MapView;
