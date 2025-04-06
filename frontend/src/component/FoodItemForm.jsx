import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';

const FoodItemForm = ({ onSubmit, initialData, isEditMode }) => {
  const defaultFormState = {
    name: '',
    price: '',
    description: '',
    category: '',
    image: '', // Changed from imageUrl to image
    preparationTime: '', // Added preparationTime
    available: true,
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      // Populate form if in edit mode and data is provided
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        description: initialData.description || '',
        category: initialData.category || '',
        image: initialData.image || '', // Changed from imageUrl
        preparationTime: initialData.preparationTime || '', // Added preparationTime
        available: initialData.available !== undefined ? initialData.available : true,
      });
    } else {
      // Reset form if not in edit mode or no initial data
      setFormData(defaultFormState);
    }
    // Reset loading state when mode or data changes
    setLoading(false);
  }, [initialData, isEditMode]); // Rerun effect when initialData or isEditMode changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert price and prep time to numbers before submitting
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        preparationTime: parseInt(formData.preparationTime, 10) || 0, // Ensure prep time is an integer
      };
      // Basic frontend validation (can be enhanced)
      if (!submissionData.name || !submissionData.price || !submissionData.description || !submissionData.image || !submissionData.category || !submissionData.preparationTime) {
          throw new Error("Please fill in all required fields.");
      }
      await onSubmit(submissionData);
      // Optionally reset form after successful submission if not in edit mode
      if (!isEditMode) {
         setFormData(defaultFormState);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Handle error display to user if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEditMode ? 'Edit Food Item' : 'Add New Food Item'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number" // Use number type for price
            inputProps={{ step: "0.01" }} // Allow decimals
            value={formData.price}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            variant="outlined"
            size="small"
            helperText="e.g., Appetizer, Main Course, Dessert"
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image" // Changed from imageUrl
            value={formData.image} // Changed from imageUrl
            onChange={handleChange}
            required // Make image required as per schema
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Preparation Time (minutes)"
            name="preparationTime" // Added field
            type="number"
            inputProps={{ min: "1" }} // Basic validation
            value={formData.preparationTime}
            onChange={handleChange}
            variant="outlined"
            size="small"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.available}
                onChange={handleChange}
                name="available"
              />
            }
            label="Available for Ordering"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Item' : 'Add Item')}
          </Button>
           {/* Optionally add a cancel button for edit mode */}
           {isEditMode && (
             <Button variant="outlined" onClick={() => setFormData(defaultFormState)} disabled={loading}>
               Cancel Edit
             </Button>
           )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default FoodItemForm;
