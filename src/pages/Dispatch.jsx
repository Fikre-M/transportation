import { Box, Typography, Paper } from "@mui/material";

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
          Real-time dispatch management will be available here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dispatch;
