const {promisify} = require("util")
const jwt = require("jsonwebtoken")
const User = require("../model/userModel")

const isAutenticated = async(req, res, next)=>{
    
    const token = req.headers.authorization
   console.log(token)

   if(!token){
       return res.status(403).json({
        message:"please login"
       })
   }

   const decode = await promisify(jwt.verify)(token,"helloWorld")

   console.log(decode)

   const doesUserExist = await User.findOne({_id:decode.id})
    console.log(doesUserExist)

    if(!doesUserExist){
        return res.status(404).json({
            message:"user doesn't exists with that token"
        })
    }
    req.user = doesUserExist
    next()

} 

module.exports=isAutenticated;