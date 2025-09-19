const express = require("express");
const { datbaseConnect } = require("./database/dbconnect");
const authRouter = require("./routes/authRoute")
const productRoute = require("./routes/productRoute")

require("dotenv").config()

const app = express();

app.use(express.json())

datbaseConnect(process.env.MONGO_URI)

// http://localhost:3000/api/auth/register

app.use("/api/auth/",authRouter)
app.use("/api/admin/product/",productRoute)


app.listen(process.env.PORT, ()=>{
    console.log("server is starting port number: 3000")
})