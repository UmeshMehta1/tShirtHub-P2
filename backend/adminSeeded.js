const bcrypt = require("bcryptjs")
const User = require("./model/userModel")
exports.adminSeeder = async()=>{
    const isAdminExist = await User.findOne({userEmail:"admin12@gmail.com"})
    
        if(isAdminExist){
            console.log("admin is already seeded")
        }else{
     await User.create({
            userEmail:"admin12@gmail.com",
            userPassword: bcrypt.hashSync("admin",8),
            userPhoneNumber:"1234567890",
            userName:"admin",
            role:"admin"
        })
    
        console.log("admin seeded successfully")
        }
    
}