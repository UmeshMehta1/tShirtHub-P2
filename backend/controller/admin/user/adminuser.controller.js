const User = require("../../../model/userModel")

exports.getUser = async(req, res)=>{
    const userId = req.user.id
    console.log(userId)
    
    const users = await User.find({_id:{$ne:userId}}).select(["-userPassword", "-otp", "-isOtpVerified", "-createdAt", "-updatedAt", "-__v"])
    // const users = await User.find({_id:{$ne:userId}}).select(["-userPassword", "-otp", "-isOtpVerified", "-__v"])
    console.log(users)

    if(users.length>0){

        return res.status(200).json({
        message:"user fetch successfully",
        data:users
        })
        
    }
    res.status(400).json({
        message:"user is not found",
        data:[]
    })
}
