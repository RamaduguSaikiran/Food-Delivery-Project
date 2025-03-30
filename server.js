const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/user');
const MenuItem = require('./models/menuItem');
const Order = require('./models/order');
const Cart = require('./models/cart');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) return res.status(401).json({ message: "Access denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId);
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Auth routes
app.post('/register', async (req, res) => {
    const { user, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            user,
            email,
            password: hashPassword
        });
        await newUser.save();
        
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
        res.status(201).json({ message: "User created successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ message: "Login successful", token, username: user.user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Menu routes
app.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ available: true });
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ message: "Error fetching menu", error: err.message });
    }
});

app.post('/menu', authenticateToken, async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: "Error creating menu item", error: err.message });
    }
});

// Cart routes
app.get('/cart', authenticateToken, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cart", error: err.message });
    }
});

app.post('/cart/add', authenticateToken, async (req, res) => {
    try {
        const { menuItemId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.menuItem.toString() === menuItemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ menuItem: menuItemId, quantity });
        }

        // Recalculate total
        const menuItems = await MenuItem.find({
            _id: { $in: cart.items.map(item => item.menuItem) }
        });
        
        cart.totalAmount = cart.items.reduce((total, item) => {
            const menuItem = menuItems.find(mi => mi._id.toString() === item.menuItem.toString());
            return total + (item.quantity * (menuItem ? menuItem.price : 0));
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Error adding to cart", error: err.message });
    }
});

app.put('/cart/update', authenticateToken, async (req, res) => {
    try {
        const { menuItemId, quantity } = req.body;
        
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }
        
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        
        cart.items[itemIndex].quantity = quantity;
        
        // Recalculate total
        const menuItems = await MenuItem.find({
            _id: { $in: cart.items.map(item => item.menuItem) }
        });
        
        cart.totalAmount = cart.items.reduce((total, item) => {
            const menuItem = menuItems.find(mi => mi._id.toString() === item.menuItem.toString());
            return total + (item.quantity * (menuItem ? menuItem.price : 0));
        }, 0);
        
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Error updating cart", error: err.message });
    }
});

app.delete('/cart/remove', authenticateToken, async (req, res) => {
    try {
        const { menuItemId } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);
        
        // Recalculate total
        const menuItems = await MenuItem.find({
            _id: { $in: cart.items.map(item => item.menuItem) }
        });
        
        cart.totalAmount = cart.items.reduce((total, item) => {
            const menuItem = menuItems.find(mi => mi._id.toString() === item.menuItem.toString());
            return total + (item.quantity * (menuItem ? menuItem.price : 0));
        }, 0);
        
        await cart.save();
        res.json({ message: "Item removed from cart", cart });
    } catch (err) {
        res.status(500).json({ message: "Error removing from cart", error: err.message });
    }
});

// Order routes
app.post('/orders', authenticateToken, async (req, res) => {
    try {
        const { deliveryAddress, paymentMethod, specialInstructions } = req.body;
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orderItems = cart.items.map(item => ({
            menuItem: item.menuItem._id,
            quantity: item.quantity,
            price: item.menuItem.price
        }));

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            totalAmount: cart.totalAmount,
            deliveryAddress,
            paymentMethod,
            specialInstructions
        });

        await order.save();
        
        // Clear cart after order
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: "Error creating order", error: err.message });
    }
});

app.get('/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.menuItem')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err.message });
    }
});

// Start server
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Server is running on port ${PORT}`);
});