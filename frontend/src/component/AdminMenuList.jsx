import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const AdminMenuList = ({ menuItems, isLoading, error, onEdit, onDelete }) => {

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>Error fetching menu items: {error}</Alert>;
  }

  if (!menuItems || menuItems.length === 0) {
    return <Typography sx={{ my: 3, textAlign: 'center' }}>No menu items found.</Typography>;
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 3 }}>
      {menuItems.map((item, index) => (
        <React.Fragment key={item._id}>
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item)} sx={{ mr: 1 }}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item._id)}>
                  <Delete color="error" />
                </IconButton>
              </Box>
            }
          >
            <ListItemAvatar>
              <Avatar alt={item.name} src={item.image || '/placeholder.png'} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
              }
              secondary={
                <Box component="span" sx={{ display: 'block' }}> {/* Explicit Box container */}
                  <Typography
                    sx={{ display: 'block' }}
                    component="span" // Keep Typography as span
                    variant="body2"
                    color="text.primary"
                  >
                    Price: ₹{item.price?.toFixed(2)}
                  </Typography>
                  <Typography
                     sx={{ display: 'block', mb: 1 }}
                     component="span" // Keep as span
                     variant="body2"
                     color="text.secondary"
                   >
                     {item.description}
                   </Typography>
                   {/* Chips are now safely inside the Box */}
                   <Chip
                     label={item.available ? 'Available' : 'Unavailable'}
                     color={item.available ? 'success' : 'default'}
                     size="small"
                     variant="outlined"
                     sx={{ mr: 1 }} // Add some margin
                   />
                   {item.category && (
                     <Chip
                       label={item.category}
                       size="small"
                       // sx={{ ml: 1 }} // Removed redundant margin if mr is used above
                     />
                   )}
                </Box>
              }
            />
          </ListItem>
          {index < menuItems.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default AdminMenuList;
