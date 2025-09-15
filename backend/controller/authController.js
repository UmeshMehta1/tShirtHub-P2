const User = require("../model/userModel")
const bcrypt = require("bcryptjs")
const sendEmail = require("../service/sendEmail")

exports.registerUser= async(req,res)=>{
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
         userPassword: bcrypt.hashSync(password,8)
    })

    res.status(201).json({
        message:"registration successully",
        data:userData
    })

}



exports.loginUser = async(req,res)=>{
    const {email, password} = req.body
    console.log(email, password)
     
    if(!email || !password){
      return  res.status(400).json({
            message:"email, password most be provide"
        })
    }
  
    const userFound = await User.find({userEmail:email})
    if(userFound.length==0){
        return res.status(400).json({
            message:"this email is not register"
        })
    }
    
    const isMatched= bcrypt.compareSync(password,userFound[0].userPassword)


    if(isMatched){
         res.status(200).json({
        message:"user logged in successfully",
        data: userFound
    })
    }else{
        res.status(400).json({
            message:"Invalid password"
        })
    }

}


exports.forgotPassword = async(req, res)=>{
    const {email} = req.body
     console.log("hello")
    if(!email){
        return res.status(400).json({
            message:"please provide email"
        })
    }
  
    const userExist = await User.find({userEmail:email})

    if(userExist.length===0){
        return res.status(400).json({
            message:"user email is not register"
        })
    }


   const otp = Math.floor(1000+Math.random()*9000)
   console.log(otp)

   userExist[0].otp=otp
    await userExist[0].save()

   await sendEmail({
    email: email,
    subject:"verification otp",
    message:"your otp is: "+otp

   })

   res.status(200).json({
    message: "OTP send successfully",
   })
    
}

exports.verifyOtp = async(req,res)=>{
    const {email, otp} = req.body

    if(!email || !otp){
        return res.status(400).json({
            message:"email and otp must be provide"
        })
    }

    const userExists = await User.find({userEmail:email}).select("+otp +isOtpVerified")
    
    // console.log(userExist)

    if(userExists.length===0){
        return res.status(400).json({
            message:"email is not regster"
        })
    }

    if(userExists[0].otp !==otp){
        return res.status(404).json({
            message:"Inviled Otp"
        })
    }else{
        userExists[0].otp = undefined,
        userExists[0].isOtpVerified= true,
        await userExists[0].save()

        res.status(200).json({
            message:"otp is verify"
        })
    }
}