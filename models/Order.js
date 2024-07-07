const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderItems : [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"OrderItem",
    required:true
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  
  amount : {
    type: Number,
    required: true
  },
  address: {
    type:Object,
    required: true,
    
  },
  status: {
    type:String,
    default:"pending",
}
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
