import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  MyLocation as MyLocationIcon,
  FilterList as FilterListIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';

const MapControls = ({
  onZoomIn,
  onZoomOut,
  onLocateMe,
  onToggleFilters,
  onToggleHeatmap,
  showHeatmap,
  sx = {}
}) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: 3,
        ...sx,
      }}
    >
      <Tooltip title="Zoom in" placement="left">
        <IconButton onClick={onZoomIn} size="large">
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      
      <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Tooltip title="Zoom out" placement="left">
          <IconButton onClick={onZoomOut} size="large">
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Tooltip title="My location" placement="left">
        <IconButton onClick={onLocateMe} size="large">
          <MyLocationIcon />
        </IconButton>
      </Tooltip>
      
      <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Tooltip title="Toggle heatmap" placement="left">
          <IconButton 
            onClick={onToggleHeatmap} 
            size="large"
            color={showHeatmap ? 'primary' : 'default'}
          >
            <LayersIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Tooltip title="Filters" placement="left">
        <IconButton onClick={onToggleFilters} size="large">
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default MapControls;
