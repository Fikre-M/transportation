import { useCallback } from 'react';
import { Marker } from 'react-map-gl';
import { Box } from '@mui/material';

const VehicleMarker = ({ vehicle, onClick, isSelected }) => {
  const { location, status } = vehicle;
  
  const statusColors = {
    available: '#4caf50',
    on_trip: '#2196f3',
    maintenance: '#ff9800',
    offline: '#f44336',
    idle: '#9e9e9e'
  };

  const handleClick = useCallback((e) => {
    e.originalEvent.stopPropagation();
    onClick(vehicle);
  }, [onClick, vehicle]);

  return (
    <Marker
      longitude={location.lng}
      latitude={location.lat}
      anchor="bottom"
      onClick={handleClick}
    >
      <Box
        sx={{
          position: 'relative',
          width: isSelected ? 24 : 20,
          height: isSelected ? 24 : 20,
          borderRadius: '50%',
          backgroundColor: statusColors[status] || '#9e9e9e',
          border: `2px solid ${isSelected ? '#fff' : 'transparent'}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.2)',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: isSelected ? 8 : 6,
            height: isSelected ? 8 : 6,
            borderRadius: '50%',
            backgroundColor: '#fff',
            transform: 'translate(-50%, -50%)',
          }
        }}
      />
    </Marker>
  );
};

export default VehicleMarker;
