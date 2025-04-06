const mongoose = require('mongoose');
require('dotenv').config();
const MenuItem = require('./models/menuItem');

// Sample menu items
const menuItems = [
  {
    name: 'ButterCorn Pizza',
    description: 'Fresh tomatoes, mozzarella, and basil with sweet corn toppings',
    price: 269,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3',
    category: 'Pizza',
    isVegetarian: true,
    spicyLevel: 2,
    preparationTime: 20,
    available: true
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with extra cheese',
    price: 259,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3',
    category: 'Pizza',
    isVegetarian: false,
    spicyLevel: 3,
    preparationTime: 18,
    available: true
  },
  {
    name: 'Cheese Burger',
    description: 'Angus beef with cheddar cheese',
    price: 399,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3',
    category: 'Burgers',
    isVegetarian: false,
    spicyLevel: 2,
    preparationTime: 15,
    available: true
  },
  {
    name: 'Veg Roll',
    description: 'Fresh vegetables wrapped in a soft tortilla',
    price: 160,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3',
    category: 'Rolls',
    isVegetarian: true,
    spicyLevel: 1,
    preparationTime: 10,
    available: true
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake with ganache',
    price: 90,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3',
    category: 'Desserts',
    isVegetarian: true,
    spicyLevel: 1,
    preparationTime: 5,
    available: true
  },
  {
    name: 'Strawberry Smoothie',
    description: 'Fresh strawberries blended with yogurt',
    price: 180,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3',
    category: 'Drinks',
    isVegetarian: true,
    spicyLevel: 1,
    preparationTime: 7,
    available: true
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Insert new menu items
    const result = await MenuItem.insertMany(menuItems);
    console.log(`Added ${result.length} menu items to the database`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 