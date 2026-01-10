import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Slider, FormControlLabel, Switch, useTheme, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Map, NavigationControl, ScaleControl, GeolocateControl, FullscreenControl } from 'react-map-gl';
import { api } from '@/api';
import MapControls from './components/MapControls';
import MapLegend from './components/MapLegend';
import VehicleMarker from './components/VehicleMarker';
import MapFilterPanel from './components/MapFilterPanel';

// Mapbox token should be in your environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'your_mapbox_token';

const MapView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const mapRef = useRef(null);
  
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
    bearing: 0,
    pitch: 45
  });

  const [filters, setFilters] = useState({
    status: ['available', 'on_trip'],
    vehicleType: ['truck', 'van', 'car', 'scooter']
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapRadius, setHeatmapRadius] = useState(20);

  // Fetch vehicles data
  const { data: vehicles = [], isLoading } = useQuery(
    ['vehicles', filters],
    () => api.get('/vehicles', { params: filters }).then(res => res.data),
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );

  // Map event handlers
  const handleMapLoad = useCallback((event) => {
    mapRef.current = event.target;
  }, []);

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) mapRef.current.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) mapRef.current.zoomOut();
  }, []);

  const handleLocateMe = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setViewport(v => ({
          ...v,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 14
        }));
      },
      (err) => console.error('Error getting location:', err),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleVehicleSelect = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setViewport(v => ({
      ...v,
      latitude: vehicle.location.lat,
      longitude: vehicle.location.lng,
      zoom: 16
    }));
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={evt => setViewport(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={handleMapLoad}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Map Controls */}
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />
        <GeolocateControl
          position="top-right"
          onGeolocate={handleLocateMe}
          trackUserLocation
        />
        <FullscreenControl position="top-right" />

        {/* Vehicle Markers */}
        {vehicles.map(vehicle => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            onClick={handleVehicleSelect}
            isSelected={selectedVehicle?.id === vehicle.id}
          />
        ))}

        {/* Map Legend */}
        <MapLegend
          position="bottom-left"
          items={[
            { label: 'Available', color: '#4caf50' },
            { label: 'On Trip', color: '#2196f3' },
            { label: 'Maintenance', color: '#ff9800' },
            { label: 'Offline', color: '#f44336' }
          ]}
        />
      </Map>

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocateMe={handleLocateMe}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        showHeatmap={showHeatmap}
      />

      {/* Filter Panel */}
      <MapFilterPanel
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={(filterName, value) =>
          setFilters(prev => ({ ...prev, [filterName]: value }))
        }
      />

      {/* Selected Vehicle Card */}
      {selectedVehicle && (
        <Card sx={{ position: 'absolute', bottom: 16, left: 16, width: 300, zIndex: 1 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6">{selectedVehicle.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedVehicle.driver || 'No driver assigned'}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedVehicle(null)}>
                ×
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MapView;
