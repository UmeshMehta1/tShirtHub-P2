const express = require("express");
const { datbaseConnect } = require("./database/dbconnect");
const authRouter = require("./routes/authRoute")
const productRoute = require("./routes/productRoute")
const adminuserRoute = require("./routes/adminuserRoute")
const reviewRoute = require("./routes/review.route")
const cartRoute = require("./routes/cartRoute")
const userOrderRoute = require("./routes/userorderRoute")
const adminOrderRoute = require("./routes/adminorderRoute")
require("dotenv").config()

const app = express();

app.use(express.json())
app.use(express.urlencoded())

// http://localhost:3000/api/auth/register

app.use("/api/auth/",authRouter)
app.use("/api/admin/product/",productRoute)
app.use("/api/admin/",adminuserRoute)
app.use("/api/review/",reviewRoute)
app.use("/api/cart/",cartRoute )
app.use("/api/order",userOrderRoute)
app.use("/api/admin/order", adminOrderRoute)

// Start server only after database connection is established
const startServer = async () => {
    await datbaseConnect(process.env.MONGO_URI)
    
    app.listen(process.env.PORT, ()=>{
        console.log("server is starting port number: 3000")
    })
}

startServer()