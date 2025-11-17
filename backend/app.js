const express = require("express");
const { datbaseConnect } = require("./database/dbconnect");
const authRouter = require("./routes/authRoute")
const productRoute = require("./routes/productRoute")
const adminuserRoute = require("./routes/adminuserRoute")
const reviewRoute = require("./routes/review.route")
const cartRoute = require("./routes/cartRoute")
const userOrderRoute = require("./routes/userorderRoute")
const adminOrderRoute = require("./routes/adminorderRoute")
const cors = require("cors")
require("dotenv").config()

const axios = require('axios')

const cron = require("node-cron")

const app = express();

app.use(cors(
    {
        origin:["https://t-shirt-hub-p2.vercel.app/","https://t-shirt-hub-p2-j99n.vercel.app/"]
    }
))


app.use(express.json())
app.use(express.urlencoded())

// Serve static files from upload directory
app.use('/upload', express.static('upload'))

app.get("/",(req,res)=>{
    res.send("server is live")
})
const callAPI = async () => {
  try {
    const response = await axios.get("https://tshirthub-p2.onrender.com/");
    console.log("API called successfully at", new Date().toLocaleString());
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error calling API:", error.message);
  }
};

// ✅ Schedule: Every 15 minutes
cron.schedule("*/15 * * * *", () => {
  console.log("Running API call job...");
  callAPI();
});

// Keep process alive
console.log("Cron job started! API will be hit every 15 minutes.");

// http://localhost:3000/api/auth/register

app.use("/api/auth/",authRouter)
app.use("/api/admin/product/",productRoute)
app.use("/api/admin/",adminuserRoute)
app.use("/api/review/",reviewRoute)
app.use("/api/cart/",cartRoute )
app.use("/api/order",userOrderRoute)
app.use("/api/admin/order", adminOrderRoute)
app.use("/api/payment", require("./routes/payment.Route"))

//http://localhost:3000/api/paymen

// Start server only after database connection is established
const startServer = async () => {
    await datbaseConnect(process.env.MONGO_URI)
    
    app.listen(process.env.PORT, ()=>{
        console.log("server is starting port number: 3000")
    })
}


startServer()