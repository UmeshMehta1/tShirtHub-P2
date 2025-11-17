const {promisify} = require("util")
const jwt = require("jsonwebtoken")
const User = require("../model/userModel")

const isAutenticated = async(req, res, next)=>{
    
    const token = req.headers.authorization

   if(!token){
       return res.status(403).json({
        message:"please login"
       })
   }

   try {
       const decode = await promisify(jwt.verify)(token,"helloWorld")

       const doesUserExist = await User.findOne({_id:decode.id})

       if(!doesUserExist){
           return res.status(404).json({
               message:"user doesn't exists with that token"
           })
       }
       req.user = doesUserExist
       next()
   } catch (error) {
       return res.status(403).json({
           message:"Invalid or expired token"
       })
   }

} 

module.exports=isAutenticated;