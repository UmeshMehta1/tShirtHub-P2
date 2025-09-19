const mongoose = require("mongoose")
const User = require("../model/userModel")


exports.datbaseConnect = async (URI)=>{
 mongoose.connect(URI)
    console.log("database is connect successfully")
    
    const isAdminExist = await User.findOne({userEmail:"admin12@gmail.com"})

    if(isAdminExist){
        console.log("admin is already seeded")
    }else{
 await User.create({
        userEmail:"admin12@gmail.com",
        userPassword:"admin",
        userPhoneNumber:"1234567890",
        userName:"admin",
        role:"admin"
    })

    console.log("admin seeded successfully")
    }

   

}