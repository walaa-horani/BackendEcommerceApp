const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true,
   
  }
});

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
