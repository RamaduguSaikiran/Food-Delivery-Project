import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Save token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', formData.user);
      }
      
      // Redirect to login or home page
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" component="h1" gutterBottom>
                Create Account
              </Typography>
              <Typography color="text.secondary">
                Join Foodie and start ordering
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Username"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    borderRadius: '30px',
                    padding: '12px',
                  }}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </Stack>
            </form>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Typography color="text.secondary">Already have an account?</Typography>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 500 }}
              >
                Sign In
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register;
