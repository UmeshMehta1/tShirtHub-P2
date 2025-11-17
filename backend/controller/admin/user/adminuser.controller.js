const User = require("../../../model/userModel")

exports.getUser = async(req, res)=>{
    const userId = req.user._id
    
    const users = await User.find({_id:{$ne:userId}}).select(["-userPassword", "-otp", "-isOtpVerified", "-createdAt", "-updatedAt", "-__v"])

    if(users.length>0){
        return res.status(200).json({
            message:"user fetch successfully",
            data:users
        })
    }
    
    return res.status(400).json({
        message:"user is not found",
        data:[]
    })
}
