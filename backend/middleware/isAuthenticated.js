
const isAutenticated = async(req, res, next)=>{
    
    const token = req.headers.authorization
   console.log(token)

   if(!token){
       return res.status(403).json({
        message:"please login"
       })
   }

   const decode = await promisify(jwt.verify)(token,slkjlsldks)

   console.log(decode)

   const doesUserExist = await User.findOne({_id:decode.id})
    
    next()

} 

module.exports=isAutenticated;