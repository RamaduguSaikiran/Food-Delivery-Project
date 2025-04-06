import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
        About Us
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Our Story
            </Typography>
            <Typography paragraph>
              Welcome to Foodie, your premier destination for delicious food delivery. Founded in 2024,
              we've been committed to bringing the finest culinary experiences right to your doorstep.
            </Typography>
            <Typography paragraph>
              Our mission is to connect food lovers with the best local restaurants, ensuring quick
              delivery while maintaining the quality and temperature of your favorite dishes.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Why Choose Us?
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" paragraph>
                Wide selection of restaurants and cuisines
              </Typography>
              <Typography component="li" paragraph>
                Fast and reliable delivery service
              </Typography>
              <Typography component="li" paragraph>
                Easy-to-use ordering platform
              </Typography>
              <Typography component="li" paragraph>
                Excellent customer support
              </Typography>
              <Typography component="li" paragraph>
                Secure payment options
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 