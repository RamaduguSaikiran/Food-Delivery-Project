import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setSnackbar({
      open: true,
      message: 'Thank you for your message! We will get back to you soon.',
      severity: 'success',
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
        Contact Us
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Get in Touch
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="message"
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Contact Information
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Email color="primary" sx={{ mr: 2 }} />
                <Typography>support@foodie.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Phone color="primary" sx={{ mr: 2 }} />
                <Typography>+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOn color="primary" sx={{ mr: 2 }} />
                <Typography>123 Food Street, Cuisine City, FC 12345</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact; 