const mongoose = require('mongoose');

const MenuItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isVegetarian: {
        type: Boolean,
        default: false
    },
    spicyLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    preparationTime: {
        type: Number, // in minutes
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', MenuItemSchema); 