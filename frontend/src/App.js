import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './component/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard
import ProtectedRoute from './component/ProtectedRoute'; // Import ProtectedRoute

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4B3A',
    },
    secondary: {
      main: '#40C057',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/menu" element={<Menu />} /> {/* Menu viewable by all */}

            {/* Protected Routes (Require Login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              {/* Add other customer-specific logged-in routes here if needed */}
            </Route>

            {/* Protected Admin Routes (Require Login + Admin Role) */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Add other admin-specific routes here */}
            </Route>

            {/* Optional: Add a 404 Not Found route */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
