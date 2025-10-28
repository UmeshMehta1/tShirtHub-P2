const express = require("express");
const { datbaseConnect } = require("./database/dbconnect");
const authRouter = require("./routes/authRoute")
const productRoute = require("./routes/productRoute")
const adminuserRoute = require("./routes/adminuserRoute")
const reviewRoute = require("./routes/review.route")
const cartRoute = require("./routes/cartRoute")
require("dotenv").config()

const app = express();

app.use(express.json())
app.use(express.urlencoded())

datbaseConnect(process.env.MONGO_URI)

// http://localhost:3000/api/auth/register

app.use("/api/auth/",authRouter)
app.use("/api/admin/product/",productRoute)
app.use("/api/admin/",adminuserRoute)
app.use("/api/review/",reviewRoute)
app.use("/api/cart/",cartRoute )

app.listen(process.env.PORT, ()=>{
    console.log("server is starting port number: 3000")
})