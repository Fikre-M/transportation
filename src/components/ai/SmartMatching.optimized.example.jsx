/**
 * EXAMPLE: Optimized SmartMatching Component
 * 
 * This is an example showing how to optimize the SmartMatching component with:
 * 1. Direct MUI imports (tree-shaking)
 * 2. useAIQuery hook (caching, debouncing, budget guards)
 * 3. OptimizedMotion (smaller bundle)
 * 
 * To use this:
 * 1. Review the changes
 * 2. Apply similar patterns to SmartMatching.jsx
 * 3. Test thoroughly
 * 4. Delete this example file
 */

import { useState } from 'react';
// ✅ Direct MUI imports for tree-shaking
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';

// ✅ Direct icon imports
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import StarIcon from '@mui/icons-material/Star';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';

// Recharts
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from 'recharts';

// ✅ Optimized motion
import { OptimizedMotion, animationVariants } from '../../components/common/OptimizedMotion';

// ✅ AI query hook with caching and budget guards
import { useAIQuery } from '../../hooks/useAIQuery';
import aiService from '../../services/aiService';

const MatchCard = styled(Card)(({ theme, selected }) => ({
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  background: selected ? `${theme.palette.primary.main}08` : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const ScoreCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.main}25 100%)`,
  border: `1px solid ${theme.palette.success.main}`,
}));

const SmartMatchingOptimized = () => {
  const [passengerRequest, setPassengerRequest] = useState({
    pickup: 'Bole Area',
    destination: 'Piazza',
    passengerCount: 1,
    vehiclePreference: 'any',
    priorityFactor: 'time',
  });
  const [selectedDriver, setSelectedDriver] = useState(null);

  // ✅ Use optimized AI query hook
  const { 
    data: matching, 
    isLoading: isMatching, 
    error,
    refetch: findMatches,
    debouncedRefetch,
    canMakeRequest,
    budgetExceeded,
  } = useAIQuery({
    queryKey: ['smart-matching', passengerRequest],
    queryFn: async () => {
      const result = await aiService.matchDriverPassenger(passengerRequest);
      return result;
    },
    feature: 'smart_matching',
    enabled: true,
    debounce: true, // 800ms debounce
    onSuccess: (data) => {
      setSelectedDriver(data.matchedDriver);
    },
  });

  const handleInputChange = (field) => (event) => {
    setPassengerRequest({
      ...passengerRequest,
      [field]: event.target.value,
    });
    // Debounced refetch will trigger automatically
    debouncedRefetch();
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const radarData = matching ? [
    { factor: 'Proximity', score: matching.matchingFactors.proximity * 100 },
    { factor: 'Rating', score: matching.matchingFactors.rating * 100 },
    { factor: 'Vehicle', score: matching.matchingFactors.vehicleType * 100 },
    { factor: 'Availability', score: matching.matchingFactors.availability * 100 },
  ] : [];

  return (
    <Box sx={{ p: 3 }}>
      {/* Budget Warning */}
      {budgetExceeded && (
        <Alert severity="error" sx={{ mb: 3 }}>
          AI budget limit reached. Please reset or increase your budget limit to continue.
        </Alert>
      )}

      {/* Header - ✅ Using OptimizedMotion */}
      <OptimizedMotion.div
        initial={animationVariants.fadeIn.initial}
        animate={animationVariants.fadeIn.animate}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <PersonSearchIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Smart Driver Matching
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered driver-passenger matching with real-time optimization
            </Typography>
          </Box>
        </Box>
      </OptimizedMotion.div>

      {/* Request Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PsychologyIcon color="primary" />
          Passenger Request
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pickup Location"
              value={passengerRequest.pickup}
              onChange={handleInputChange('pickup')}
              disabled={isMatching || budgetExceeded}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Destination"
              value={passengerRequest.destination}
              onChange={handleInputChange('destination')}
              disabled={isMatching || budgetExceeded}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Vehicle Preference"
              value={passengerRequest.vehiclePreference}
              onChange={handleInputChange('vehiclePreference')}
              disabled={isMatching || budgetExceeded}
              SelectProps={{ native: true }}
            >
              <option value="any">Any</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Priority"
              value={passengerRequest.priorityFactor}
              onChange={handleInputChange('priorityFactor')}
              disabled={isMatching || budgetExceeded}
              SelectProps={{ native: true }}
            >
              <option value="time">Fastest</option>
              <option value="cost">Cheapest</option>
              <option value="rating">Highest Rated</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => findMatches()}
              disabled={isMatching || budgetExceeded || !canMakeRequest}
              startIcon={<PersonSearchIcon />}
            >
              {isMatching ? 'Matching...' : 'Find Match'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {isMatching && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            AI is analyzing available drivers...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'Failed to find driver matches. Please try again.'}
        </Alert>
      )}

      {/* Results - ✅ Using OptimizedMotion */}
      {matching && !isMatching && (
        <OptimizedMotion.div
          initial={animationVariants.slideUp.initial}
          animate={animationVariants.slideUp.animate}
        >
          <Grid container spacing={3}>
            {/* Match Score */}
            <Grid item xs={12} md={4}>
              <ScoreCard>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {(matching.matchScore * 100).toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Match Score
                </Typography>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Excellent Match"
                  color="success"
                  sx={{ mt: 1 }}
                />
              </ScoreCard>
            </Grid>

            {/* Radar Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Matching Factors
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Matched Driver */}
            <Grid item xs={12}>
              <MatchCard selected>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                      {matching.matchedDriver.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {matching.matchedDriver.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={matching.matchedDriver.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {matching.matchedDriver.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Best Match"
                      color="success"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Vehicle
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {matching.matchedDriver.vehicle}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            ETA
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {matching.matchedDriver.eta} min
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Distance
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            2.5 km
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SpeedIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Acceptance Rate
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            95%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button variant="contained" fullWidth>
                      Confirm Match
                    </Button>
                    <Button variant="outlined" fullWidth>
                      View Alternatives
                    </Button>
                  </Box>
                </CardContent>
              </MatchCard>
            </Grid>
          </Grid>
        </OptimizedMotion.div>
      )}
    </Box>
  );
};

export default SmartMatchingOptimized;
