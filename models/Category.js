const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Ensures each category name is unique
    },
    description: {
        type: String
    },
    // Add more fields as needed for your category
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
