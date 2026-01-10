import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const MapFilterPanel = ({
  open,
  onClose,
  filters,
  onFilterChange,
  sx = {}
}) => {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleStatusChange = (status) => {
    const newStatus = localFilters.status.includes(status)
      ? localFilters.status.filter(s => s !== status)
      : [...localFilters.status, status];
    
    setLocalFilters(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  const handleVehicleTypeChange = (type) => {
    const newTypes = localFilters.vehicleType.includes(type)
      ? localFilters.vehicleType.filter(t => t !== type)
      : [...localFilters.vehicleType, type];
    
    setLocalFilters(prev => ({
      ...prev,
      vehicleType: newTypes
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange('status', localFilters.status);
    onFilterChange('vehicleType', localFilters.vehicleType);
    onClose();
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      status: ['available', 'on_trip', 'maintenance', 'idle'],
      vehicleType: ['truck', 'van', 'car', 'scooter']
    };
    setLocalFilters(defaultFilters);
    onFilterChange('status', defaultFilters.status);
    onFilterChange('vehicleType', defaultFilters.vehicleType);
  };

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'on_trip', label: 'On Trip' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'offline', label: 'Offline' },
    { value: 'idle', label: 'Idle' }
  ];

  const vehicleTypeOptions = [
    { value: 'truck', label: 'Trucks' },
    { value: 'van', label: 'Vans' },
    { value: 'car', label: 'Cars' },
    { value: 'scooter', label: 'Scooters' }
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 350 },
          p: 2,
          boxSizing: 'border-box',
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box display="flex" alignItems="center">
          <FilterIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {/* Status Filter */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Status
          </Typography>
          <FormGroup>
            {statusOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={localFilters.status.includes(option.value)}
                    onChange={() => handleStatusChange(option.value)}
                    size="small"
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Vehicle Type Filter */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Vehicle Type
          </Typography>
          <FormGroup>
            {vehicleTypeOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={localFilters.vehicleType.includes(option.value)}
                    onChange={() => handleVehicleTypeChange(option.value)}
                    size="small"
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Last Updated Filter */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Last Updated
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={localFilters.lastUpdated || '1h'}
              onChange={(e) =>
                setLocalFilters(prev => ({
                  ...prev,
                  lastUpdated: e.target.value
                }))
              }
              label="Time Range"
            >
              <MenuItem value="15m">Last 15 minutes</MenuItem>
              <MenuItem value="30m">Last 30 minutes</MenuItem>
              <MenuItem value="1h">Last hour</MenuItem>
              <MenuItem value="4h">Last 4 hours</MenuItem>
              <MenuItem value="24h">Last 24 hours</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleResetFilters}
          startIcon={<RefreshIcon />}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyFilters}
          sx={{ ml: 2 }}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );
};

export default MapFilterPanel;
