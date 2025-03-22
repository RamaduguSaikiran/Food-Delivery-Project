import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Sample cart data (in a real app, this would come from state management)
const cartItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: 14.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3',
  },
  {
    id: 2,
    name: 'Classic Burger',
    price: 12.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3',
  },
];

const Cart = () => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const delivery = 5.99;
  const total = subtotal + tax + delivery;

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 6, fontWeight: 600 }}>
        Your Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  mb: 2,
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100%',
                          borderRadius: '8px',
                          aspectRatio: '1',
                          objectFit: 'cover',
                        }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <IconButton size="small">
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton size="small">
                            <Add />
                          </IconButton>
                          <IconButton color="error">
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: '16px',
              position: 'sticky',
              top: '100px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Tax</Typography>
                  <Typography>${tax.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Delivery</Typography>
                  <Typography>${delivery.toFixed(2)}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    ${total.toFixed(2)}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: '30px',
                    padding: '12px',
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => navigate('/menu')}
                  sx={{
                    borderRadius: '30px',
                    padding: '12px',
                  }}
                >
                  Continue Shopping
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
