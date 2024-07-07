const express = require("express");
const router = express.Router();
const Product = require("../models/Product")
const { authJwt } = require("./authJwt"); // Corrected import statement
router.post('/product', async (req, res) => {
    try {
        const {
            title,
            description,
            image,
            categories,
            size,
            color,
            price
        } = req.body;

        const newProduct = new Product({
            title,
            description,
            image,
            categories,
            size,
            color,
            price
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET request to retrieve all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find() .populate({
            path: 'categories',
            select: 'name' // Project only the 'name' field from Category
        })
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET request to retrieve a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin rights required.' });
    }
};



// PUT request to update a product by ID
router.put('/:id', [authJwt(), isAdmin], async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE request to delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router