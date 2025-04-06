import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  RestaurantMenu,
  ShoppingCart,
  AdminPanelSettings, // Icon for Admin
  Logout as LogoutIcon, // Icon for Logout (renamed to avoid conflict)
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Use RouterLink

// Base navigation items visible to everyone
const baseNavItems = [
  { name: 'Menu', path: '/menu' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

// Admin specific navigation
const adminNavItems = [
  { name: 'Admin', path: '/admin', icon: <AdminPanelSettings fontSize="small" /> }, // Example admin route with icon
];


const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');

  // Check login status on component mount and update
  useEffect(() => {
    const updateAuthStatus = () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('role');

      if (token && storedUsername && storedRole) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
        setUserRole(storedRole);
      } else {
        // Ensure local storage is clear if any item is missing
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setUsername('');
        setUserRole('');
      }
    };

    updateAuthStatus(); // Initial check

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', updateAuthStatus);
    // Custom event listener for login/logout within the same app instance
    window.addEventListener('authChange', updateAuthStatus);


    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', updateAuthStatus);
      window.removeEventListener('authChange', updateAuthStatus);
    };
  }, []);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigation = (path) => {
    handleCloseNavMenu();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    // Dispatch custom event to notify other components (like this one) immediately
    window.dispatchEvent(new Event('authChange'));
    navigate('/login'); // Redirect to login after logout
  };

  // Combine nav items based on role
  const currentNavItems = userRole === 'admin'
    ? [...baseNavItems, ...adminNavItems]
    : baseNavItems;


  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <RestaurantMenu sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink} // Use RouterLink
            to={isLoggedIn ? (userRole === 'admin' ? '/admin' : '/menu') : '/'} // Link logo based on role/login
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            FOODIE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {/* Mobile Menu Items */}
              {currentNavItems.map((item) => (
                <MenuItem key={item.name} onClick={() => handleNavigation(item.path)}>
                  {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
                  <Typography textAlign="center">{item.name}</Typography>
                </MenuItem>
              ))}
              {/* Mobile Logout/Login */}
              {isLoggedIn ? (
                 <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }}/>
                    <Typography textAlign="center">Logout</Typography>
                 </MenuItem>
              ) : [ // Return items as an array instead of using a Fragment
                  <MenuItem key="login-mobile" onClick={() => handleNavigation('/login')}>Login</MenuItem>,
                  <MenuItem key="register-mobile" onClick={() => handleNavigation('/register')}>Register</MenuItem>
              ]}
            </Menu>
          </Box>

          <RestaurantMenu sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink} // Use RouterLink
            to={isLoggedIn ? (userRole === 'admin' ? '/admin' : '/menu') : '/'} // Link logo based on role/login
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            FOODIE
          </Typography>

          {/* Desktop Menu Items */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {currentNavItems.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                startIcon={item.icon} // Add icon if available
                sx={{ my: 2, color: 'black', display: 'block', mx: 2 }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Right side buttons/icons */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                {/* Show Cart icon only for customers */}
                {userRole === 'customer' && (
                  <IconButton onClick={() => navigate('/cart')} sx={{ mr: 2, color: 'black' }}>
                    <ShoppingCart />
                  </IconButton>
                )}
                <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                  Hi, {username}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Login/Register Buttons */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
