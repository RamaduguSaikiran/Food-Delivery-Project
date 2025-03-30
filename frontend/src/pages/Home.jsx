import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const featuredItems = [
  {
    id: 1,
    name: 'Veg Pizza',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3',
    price: '₹129',
    description: 'Loaded with cheese and fresh toppings',
  },
  {
    id: 2,
    name: 'Chicken Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3',
    price: '₹229',
    description: 'Juicy patty with fresh vegetables',
  },
  {
    id: 3,
    name: 'Chicken Wings',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3',
    price: '₹139',
    description: 'Crispy wings with special sauce',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#FFF3F0',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: '#333',
                  }}
                >
                  Delicious Food
                  <br />
                  <span style={{ color: '#FF4B3A' }}>Delivered To You</span>
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Choose your favorite meals from our broad selection of available dishes
                  and enjoy a delicious lunch or dinner at home.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/menu')}
                  sx={{
                    borderRadius: '30px',
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                  }}
                >
                  Order Now
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3"
                  alt="Hero Food"
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Items Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Featured Items
        </Typography>
        <Grid container spacing={4}>
          {featuredItems.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {item.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" color="primary">
                        {item.price}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/menu')}
                      >
                        Add to Cart
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
