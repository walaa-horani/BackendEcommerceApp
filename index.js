const express = require("express")

const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const userRouter = require("./routes/user")
const proudctRouter = require("./routes/product")
const orderRouter = require("./routes/order")
const cartRouter = require("./routes/cart")
const authRouter = require("./routes/auth")
const categoryRouter = require("./routes/category")
const {authJwt} = require('./routes/authJwt');



dotenv.config();
app.use(express.json());

// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));
app.use(authJwt());


app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/product",proudctRouter)
app.use("/api/order",orderRouter)
app.use("/api/auth",authRouter)
app.use("/api/category",categoryRouter)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.error(err));

















app.listen(5000,() =>{
    console.log("running on 5000")
})