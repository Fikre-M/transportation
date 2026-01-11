import { Box, Typography, Paper } from "@mui/material";

const Analytics = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography>The analytics dashboard is under construction.</Typography>
      </Paper>
    </Box>
  );
};

export default Analytics;
