import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Search, ShoppingCart } from '@mui/icons-material';
import { motion } from 'framer-motion';

const categories = ['All', 'Pizza', 'Burgers', 'Rolls', 'Desserts', 'Drinks'];

// Default items if API call fails
const defaultMenuItems = [
  {
    id: 1,
    name: 'ButterCorn Pizza',
    category: 'Pizza',
    price: 269,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3',
    description: 'Fresh tomatoes, mozzarella, and basil',
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: 259,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3',
    description: 'Classic pepper with extra cheese',
  },
  {
    id: 3,
    name: 'Cheese Burger',
    category: 'Burgers',
    price: 399,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3',
    description: 'Angus beef with cheddar cheese',
  },
  {
    id: 4,
    name: 'Veg Roll',
    category: 'Rolls',
    price: 160,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3',
    description: 'Tomato and cucumber',
  },
  {
    id: 5,
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 90,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3',
    description: 'Rich chocolate layer cake',
  },
  {
    id: 6,
    name: 'Strawberry Fruits',
    category: 'Drinks',
    price: 180,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3',
    description: 'Fresh strawberries and yogurt',
  },
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Try to fetch from API, if it fails, use default items
        const response = await fetch('http://localhost:5000/menu');
        
        if (!response.ok) {
          // If API returns error, use default items
          setMenuItems(defaultMenuItems);
          console.warn('Failed to fetch menu items from API, using defaults');
        } else {
          const data = await response.json();
          if (data && data.length > 0) {
            setMenuItems(data);
          } else {
            setMenuItems(defaultMenuItems);
          }
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        setMenuItems(defaultMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setNotification({
          open: true,
          message: 'Please login to add items to cart',
          severity: 'warning',
        });
        return;
      }
      
      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          menuItemId: item._id || item.id,
          quantity: 1,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      setNotification({
        open: true,
        message: `${item.name} added to cart!`,
        severity: 'success',
      });
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Error adding to cart',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container sx={{ py: 8 }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
          Our Menu
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category}
              value={category}
              sx={{
                fontWeight: 500,
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Menu Items Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredItems.map((item) => (
            <Grid item key={item._id || item.id} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
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
                    <Typography gutterBottom variant="h5" component="h2">
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
                        ₹{item.price}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCart />}
                        sx={{ borderRadius: '20px' }}
                        onClick={() => handleAddToCart(item)}
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

export default Menu;
