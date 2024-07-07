const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart")

router.post('/cart', async (req, res) => {
    const { userId, products } = req.body;
  
    // Validate request data
    if (!userId || !products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    // Create a new cart document
    const newCart = new Cart({
      userId,
      products
    });
  
    try {
      // Save the new cart to the database
      const savedCart = await newCart.save();
      res.status(201).json(savedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create cart' });
    }
  });



  router.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const cart = await Cart.findOne({ userId }).populate('products.productId');
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve cart' });
    }
  });
  
  module.exports = router