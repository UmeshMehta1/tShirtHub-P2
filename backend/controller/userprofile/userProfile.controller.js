const User = require("../../model/userModel")
const bcrypt = require("bcryptjs")

exports.getMyProfile = async(req, res)=>{
    const userId = req.user.userId
    const myProfile= await User.findById(userId)

    res.status(200).json({
        data:myProfile,
        message:"profile fetched successfully"
    })

}

exports.updaeMyProfile = async(req, res)=>{
    const userId = req.user.userId
   
    const {userName, userEmail, userPhoneNumber}= req.body
    
    const updateData= await User.findByIdAndUpdate(userId,{userName, userEmail, userPhoneNumber} )

    res.status(200).json({
        message:"profile update successfully",
        data: updateData
    })
}

exports.deleteMyProfile = async(req, res)=>{
    const userId = req.user.id;

    await User.findByIdAndDelete(userId)

    res.status(200).json({
        message:"profile delete successfully",
        data:null
    })
}

exports.updateMyPassword = async(req, res)=>{
    const userId = req.user.id;
    const {oldpassword, newpassword, confirmPassword}= req.body

    if(!oldpassword|| !newpassword || !confirmPassword){
        return res.status(400).json({
            message:"please provideoldpassword, newpassword, confirmPassword"
        })
    }
   
    if(newpassword != confirmPassword){
        return res.status(400).json({
            message:"newpassword and confirmpassword did not match"
        })
    }

    const userData = await User.findById(userId)

    const oldpasswordHas = userData.userPassword

    const isOldPasswrodCorrect = bcrypt.compareSync(oldpassword, oldpasswordHas)
    
    if(!isOldPasswrodCorrect){
        return res.status(400).json({
            message:"oldpassword is not match"
        })
    }


  userData.userPassword= bcrypt.hashSync(newpassword, 8)

  await userData.save()

  res.status(200).json({
    message:"password change successfully"
  })

}