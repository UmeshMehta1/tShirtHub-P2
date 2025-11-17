const User = require("../../../model/userModel")
const bcrypt = require("bcryptjs")
const sendEmail = require("../../../service/sendEmail")
const jwt = require("jsonwebtoken")

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

    // check if that email already exist or not.
    try {
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

        return res.status(201).json({
            message:"registration successully",
            data:userData
        })
    } catch (err) {
        // If mongoose validation error, return 400 with details
        if (err.name === 'ValidationError') {
            // collect messages
            const messages = Object.values(err.errors).map(e => e.message)
            return res.status(400).json({ message: messages.join('; ') })
        }
        // otherwise return generic 500 with message
        console.error('registerUser error:', err)
        return res.status(500).json({ message: 'Internal server error' })
    }

}

//login user

exports.loginUser = async(req,res)=>{
    const {email, password} = req.body
     
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
        const token = jwt.sign({id:userFound[0]._id},"helloWorld",{
            expiresIn:"4534535s"
        })

        return res.status(200).json({
            message:"user logged in successfully",
            data: userFound,
            token:token
        })
    }else{
        return res.status(400).json({
            message:"Invalid password"
        })
    }

}

//forgot password

exports.forgotPassword = async(req, res)=>{
    const {email} = req.body
    
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

   userExist[0].otp=otp
   userExist[0].isOtpVerified= false
    await userExist[0].save()

   await sendEmail({
    email: email,
    subject:"verification otp",
    message:"your otp is: "+otp

   })

   return res.status(200).json({
    message: "OTP send successfully",
   })
    
}
//verifyotp
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
        userExists[0].otp = undefined
        userExists[0].isOtpVerified= true
        await userExists[0].save()

        return res.status(200).json({
            message:"otp is verify"
        })
    }
}