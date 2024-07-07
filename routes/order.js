const express = require("express");
const router = express.Router();
const Order = require("../models/Order")
const OrderItem = require("../models/OrderItem")

router.post('/orders', async (req, res) => {
  const { userId, products, amount, address, status } = req.body;

  // Validate request data
  if (!userId || !products || !Array.isArray(products) || !amount || !address) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    // Create OrderItem documents
    const orderItems = await Promise.all(products.map(async (item) => {
      const orderItem = new OrderItem({
        productId: item.productId,
        quantity: item.quantity
      });
      await orderItem.save();
      return orderItem._id;
    }));

    // Create a new order document
    const newOrder = new Order({
      userId,
      orderItems,
      amount,
      address,
      status
    });

    // Save the new order to the database
    let savedOrder = await newOrder.save();

    // Populate the userId and productId fields
    savedOrder = await Order.findById(savedOrder._id)
      .populate('userId', 'name email') // Populate user details
      .populate({
        path: 'orderItems',
        populate: {
          path: 'productId',
          select: 'title price' // Populate product details
        }
      });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router