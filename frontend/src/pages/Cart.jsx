import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Fallback cart data if API fails
const fallbackCartItems = [
  {
    id: 1,
    name: 'ButterCorn Pizza',
    price: 359,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3',
  },
  {
    id: 2,
    name: 'Classic Burger',
    price: 199,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3',
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          // If not logged in, use fallback data and show notification
          setCartItems(fallbackCartItems);
          setNotification({
            open: true,
            message: 'Please login to view your actual cart',
            severity: 'warning',
          });
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }

        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
          // Transform API response to match our expected format
          const formattedItems = data.items.map(item => ({
            id: item.menuItem._id,
            name: item.menuItem.name,
            price: item.menuItem.price,
            quantity: item.quantity,
            image: item.menuItem.image,
          }));
          
          setCartItems(formattedItems);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Use fallback data in case of error
        setCartItems(fallbackCartItems);
        setNotification({
          open: true,
          message: 'Error loading cart data',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle quantity changes
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) return;

      const token = localStorage.getItem('token');
      
      if (!token) {
        setNotification({
          open: true,
          message: 'Please login to update cart',
          severity: 'warning',
        });
        return;
      }

      // Optimistically update UI
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Send update to backend
      const response = await fetch('http://localhost:5000/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          menuItemId: itemId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

    } catch (error) {
      console.error('Error updating quantity:', error);
      setNotification({
        open: true,
        message: 'Error updating quantity',
        severity: 'error',
      });
    }
  };

  // Handle item removal
  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setNotification({
          open: true,
          message: 'Please login to update cart',
          severity: 'warning',
        });
        return;
      }

      // Optimistically update UI
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

      // Send delete request to backend
      const response = await fetch('http://localhost:5000/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          menuItemId: itemId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      setNotification({
        open: true,
        message: 'Item removed from cart',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error removing item:', error);
      setNotification({
        open: true,
        message: 'Error removing item',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const delivery = subtotal > 0 ? 40 : 0; // Free delivery for empty cart
  const total = subtotal + tax + delivery;

  // Handle checkout
  const handleCheckout = () => {
    // To be implemented - navigate to checkout page
    navigate('/checkout');
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 6, fontWeight: 600 }}>
        Your Cart
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : cartItems.length === 0 ? (
        <Box textAlign="center" my={8}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/menu')}
            sx={{ mt: 2, borderRadius: '30px', padding: '12px 24px' }}
          >
            Browse Menu
          </Button>
        </Box>
      ) : (
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
                              ₹{item.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <IconButton 
                              size="small"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Remove />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
                            <IconButton 
                              size="small"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Add />
                            </IconButton>
                            <IconButton 
                              color="error"
                              onClick={() => removeItem(item.id)}
                            >
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
                    <Typography>₹{subtotal.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Tax (10%)</Typography>
                    <Typography>₹{tax.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Delivery</Typography>
                    <Typography>₹{delivery.toFixed(2)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">
                      ₹{total.toFixed(2)}
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleCheckout}
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
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
