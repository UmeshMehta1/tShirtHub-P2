const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        require:[true, "username is required"]
    },

    userEmail:{
        type: String,
        require:[true, "userEmail is required"],
        lowercase:true,
        // unique:true,
    },
    
    userNumber:{
        type:String,
        require:[true, "userNumber is required"],
        minlength:10
    },
    
    userPassword:{
        type:String,
        required:[true, "user Password is required"]
    },

    role:{
        type: String,
       enum: ["customer","admin"],
    default:"customer"
    },
    
   otp:{
    type:Number,
    default: null,
    select:false
   },

   isOtpVerified:{
    type:Boolean,
    default:false,
    select:false
   },

   cart:[{type: Schema.Types.ObjectId, ref:"Product"}]
},{
    timestamps:true
})

const User = mongoose.model("User", userSchema)

module.exports= User