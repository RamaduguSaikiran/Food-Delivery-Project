import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Paper, Grid, Alert, Snackbar } from '@mui/material';
import FoodItemForm from '../component/FoodItemForm'; // Import the form
import AdminMenuList from '../component/AdminMenuList'; // Import the list

// Helper function to get token
const getToken = () => localStorage.getItem('token');

// API base URL (replace with your actual backend URL if different)
const API_URL = 'http://localhost:5000'; // Assuming backend runs on port 5000

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // Item currently being edited
  const [isEditMode, setIsEditMode] = useState(false); // Is the form in edit mode?
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch all menu items (including unavailable)
  const fetchMenuItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/menu/all`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle Add/Update submission
  const handleFormSubmit = async (itemData) => {
    const url = isEditMode ? `${API_URL}/admin/menu/${editingItem._id}` : `${API_URL}/admin/menu`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'add'} item`);
      }

      // Reset edit state and refresh list
      setEditingItem(null);
      setIsEditMode(false);
      fetchMenuItems(); // Refresh the list
      setSnackbar({ open: true, message: `Item successfully ${isEditMode ? 'updated' : 'added'}!`, severity: 'success' });

    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message); // Show error to user
      setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
    }
  };

  // Handle Edit button click
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditMode(true);
    // Scroll to form for better UX? Optional.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

   // Handle Cancel Edit
   const handleCancelEdit = () => {
     setEditingItem(null);
     setIsEditMode(false);
   };

  // Handle Delete button click
  const handleDelete = async (itemId) => {
    // Optional: Add confirmation dialog
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/menu/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete item');
      }

      fetchMenuItems(); // Refresh the list
      setSnackbar({ open: true, message: 'Item successfully deleted!', severity: 'success' });

    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
      setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
    }
  };

  // Placeholder for Restaurant Settings
  const RestaurantSettingsPanel = () => (
    <Paper sx={{ p: 2, textAlign: 'center', mt: 3 }}>
      <Typography variant="h6">Restaurant Settings</Typography>
      <Typography variant="body2" color="text.secondary">(Change Name - feature coming soon)</Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Admin Dashboard - Menu Management
      </Typography>

      {/* Display general errors */}
      {error && !snackbar.open && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={4}>
          <FoodItemForm
            onSubmit={handleFormSubmit}
            initialData={editingItem}
            isEditMode={isEditMode}
            // Pass a cancel handler if you add a cancel button to the form
            // onCancel={handleCancelEdit}
          />
          <RestaurantSettingsPanel />
        </Grid>

        {/* List Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Current Menu Items
          </Typography>
          <AdminMenuList
            menuItems={menuItems}
            isLoading={isLoading}
            error={null} // Errors handled above, prevent duplicate display
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
