// import { useState, useEffect, useCallback } from 'react';
// import { Box, Typography, Paper, CircularProgress } from '@mui/material';
// import Map from 'react-map-gl';
// import { MapPin, Truck } from 'lucide-react';
// import { styled } from '@mui/material/styles';

// const MapContainer = styled(Paper)(({ theme }) => ({
//   height: '100%',
//   minHeight: 400,
//   borderRadius: theme.shape.borderRadius,
//   overflow: 'hidden',
//   position: 'relative',
// }));

// const MapLoading = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: 'rgba(255, 255, 255, 0.7)',
//   zIndex: 1,
// }));

// const VehicleMarker = styled(Box, {
//   shouldForwardProp: (prop) => prop !== 'status',
// })(({ status, theme }) => ({
//   position: 'relative',
//   color: 'white',
//   backgroundColor: 
//     status === 'available' ? theme.palette.success.main :
//     status === 'in-ride' ? theme.palette.primary.main :
//     status === 'offline' ? theme.palette.grey[500] :
//     theme.palette.warning.main,
//   borderRadius: '50%',
//   width: 24,
//   height: 24,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   cursor: 'pointer',
//   transform: 'translate(-50%, -50%)',
//   '&:hover': {
//     zIndex: 10,
//     '&::after': {
//       content: '""',
//       position: 'absolute',
//       width: 32,
//       height: 32,
//       borderRadius: '50%',
//       backgroundColor: 'currentColor',
//       opacity: 0.2,
//       zIndex: -1,
//     },
//   },
// }));

// // Mock data for vehicles
// const mockVehicles = [
//   {
//     id: 'v1',
//     lat: 9.0054,
//     lng: 38.7636,
//     status: 'available',
//     driver: 'John D.',
//     type: 'sedan',
//   },
//   {
//     id: 'v2',
//     lat: 9.0154,
//     lng: 38.7736,
//     status: 'in-ride',
//     driver: 'Jane S.',
//     type: 'suv',
//   },
//   {
//     id: 'v3',
//     lat: 8.9954,
//     lng: 38.7536,
//     status: 'maintenance',
//     driver: 'Mike T.',
//     type: 'van',
//   },
// ];

// const RealTimeMap = ({ height = 400, showControls = true }) => {
//   const [loading, setLoading] = useState(true);
//   const [vehicles, setVehicles] = useState([]);
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [viewport, setViewport] = useState({
//     latitude: 9.0054,  // Default to Addis Ababa
//     longitude: 38.7636,
//     zoom: 12,
//   });

//   // Simulate real-time updates
//   useEffect(() => {
//     // Initial load
//     setVehicles(mockVehicles);
//     setLoading(false);

//     // Simulate vehicle movement
//     const interval = setInterval(() => {
//       setVehicles(currentVehicles => 
//         currentVehicles.map(vehicle => {
//           // Only move vehicles that are in-ride or available
//           if (vehicle.status === 'in-ride' || vehicle.status === 'available') {
//             const latOffset = (Math.random() - 0.5) * 0.01;
//             const lngOffset = (Math.random() - 0.5) * 0.01;
//             return {
//               ...vehicle,
//               lat: Math.min(Math.max(vehicle.lat + latOffset, 8.9), 9.1), // Keep within bounds
//               lng: Math.min(Math.max(vehicle.lng + lngOffset, 38.7), 38.8), // Keep within bounds
//               lastUpdate: new Date().toISOString(),
//             };
//           }
//           return vehicle;
//         })
//       );
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleMarkerClick = useCallback((vehicle) => {
//     setSelectedVehicle(vehicle);
//   }, []);

//   const handleViewportChange = useCallback((newViewport) => {
//     setViewport(newViewport);
//   }, []);

//   if (loading) {
//     return (
//       <MapContainer elevation={3}>
//         <MapLoading>
//           <CircularProgress size={40} />
//         </MapLoading>
//       </MapContainer>
//     );
//   }

//   return (
//     <MapContainer elevation={3} sx={{ height }}>
//       <Map
//         {...viewport}
//         style={{ width: '100%', height: '100%' }}
//         mapStyle="mapbox://styles/mapbox/streets-v11"
//         mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
//         onMove={evt => handleViewportChange(evt.viewState)}
//       >
//         {vehicles.map((vehicle) => (
//           <div
//             key={vehicle.id}
//             style={{
//               position: 'absolute',
//               left: '50%',
//               top: '50%',
//               transform: 'translate(-50%, -50%)',
//             }}
//             onClick={() => handleMarkerClick(vehicle)}
//           >
//             <VehicleMarker status={vehicle.status}>
//               <Truck size={14} />
//             </VehicleMarker>
//           </div>
//         ))}
//       </Map>

//       {selectedVehicle && (
//         <Paper
//           sx={{
//             position: 'absolute',
//             bottom: 16,
//             left: 16,
//             p: 2,
//             maxWidth: 300,
//             zIndex: 10,
//           }}
//           elevation={3}
//         >
//           <Box display="flex" alignItems="center" mb={1}>
//             <Truck size={20} style={{ marginRight: 8 }} />
//             <Typography variant="subtitle2">
//               {selectedVehicle.driver}
//             </Typography>
//           </Box>
//           <Typography variant="body2" color="text.secondary">
//             Status: {selectedVehicle.status}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Vehicle: {selectedVehicle.type.toUpperCase()}
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             Last updated: {new Date().toLocaleTimeString()}
//           </Typography>
//         </Paper>
//       )}
//     </MapContainer>
//   );
// };

// export default RealTimeMap;


// src/components/dashboard/RealTimeMap.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Truck, MapPin } from 'lucide-react';

const RealTimeMap = ({ height = 400 }) => {
  const [showMap, setShowMap] = useState(false);

  // Simple fallback UI when no map is available
  if (!showMap) {
    return (
      <Paper
        sx={{
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 3,
          bgcolor: 'background.paper',
        }}
        elevation={3}
      >
        <MapPin size={48} style={{ marginBottom: 16, color: '#666' }} />
        <Typography variant="h6" gutterBottom>
          Map Integration
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          To enable the interactive map, please provide a Mapbox access token.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowMap(true)}
          startIcon={<Truck size={16} />}
        >
          Show Static Preview
        </Button>
      </Paper>
    );
  }

  // Simple static map with vehicle markers (no external service)
  return (
    <Box
      sx={{
        height,
        position: 'relative',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
      }}
    >
      {/* Simple static map background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
          opacity: 0.8,
        }}
      />

      {/* Simple road lines */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${20 + i * 20}%`,
            height: '4px',
            backgroundColor: '#757575',
            opacity: 0.3,
          }}
        />
      ))}

      {/* Vehicle markers */}
      {[
        { id: 1, top: '30%', left: '20%', status: 'available' },
        { id: 2, top: '50%', left: '60%', status: 'in-ride' },
        { id: 3, top: '70%', left: '40%', status: 'offline' },
      ].map((vehicle) => (
        <Box
          key={vehicle.id}
          sx={{
            position: 'absolute',
            top: vehicle.top,
            left: vehicle.left,
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor:
              vehicle.status === 'available'
                ? '#4caf50'
                : vehicle.status === 'in-ride'
                ? '#2196f3'
                : '#9e9e9e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            transform: 'translate(-50%, -50%)',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'currentColor',
              opacity: 0.2,
              zIndex: -1,
            },
          }}
        >
          <Truck size={14} />
        </Box>
      ))}

      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          This is a static preview. For full interactive map functionality, please provide a Mapbox access token in your
          .env file as <code>VITE_MAPBOX_TOKEN</code>.
        </Typography>
      </Box>
    </Box>
  );
};

export default RealTimeMap;