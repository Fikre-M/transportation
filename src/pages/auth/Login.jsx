import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Link, 
  InputAdornment, 
  IconButton, 
  Alert,
  Divider,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your account to continue
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color={errors.email ? 'error' : 'action'} />
              </InputAdornment>
            ),
          }}
          {...register('email')}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color={errors.password ? 'error' : 'action'} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register('password')}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            color="primary"
            underline="hover"
          >
            Forgot password?
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 2, mb: 2, py: 1.5 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR CONTINUE WITH
        </Typography>
      </Divider>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => handleSocialLogin('google')}
          sx={{
            py: 1.5,
            textTransform: 'none',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'text.primary',
            },
          }}
        >
          Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FacebookIcon />}
          onClick={() => handleSocialLogin('facebook')}
          sx={{
            py: 1.5,
            textTransform: 'none',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'text.primary',
            },
          }}
        >
          Facebook
        </Button>
      </Stack>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            color="primary"
            fontWeight="medium"
            underline="hover"
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
