const express = require("express");
const { datbaseConnect } = require("./database/dbconnect");
const User = require("./model/userModel");

const app = express();

app.use(express.json())

datbaseConnect()



app.get("/",(req,res)=>{
    res.send("hello world")
})

app.post("/register", async(req,res)=>{
    // console.log("hello")
    // console.log(req.body);

    // const username = req.body.username
    // const email = req.body.email
    // const userNumber= req.body.userNumber
    // const password= req.body.password

    // console.log(username, email, userNumber, password)

    //distructure
    const {username, email, userNumber, password}= req.body

if(!username || !email || !userNumber || !password ){
        return res.status(400).json({
            message:"please provide username, email, userNumber, password"
        })
    }

//check if that email alread exist or not.
 
const userFound = await User.find({userEmail:email})

if(userFound.length>0){
    return res.status(400).json({
        message:"user with that email already registered",
        data:[]
    })
}


    const userData = await User.create({
         userName:username,
         userEmail: email,
         userNumber: userNumber,
         userPassword: password
    })

    res.status(201).json({
        message:"registration successully",
        data:userData
    })

})



app.listen(3000, ()=>{
    console.log("server is starting port number: 3000")
})