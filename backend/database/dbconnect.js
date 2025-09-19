const mongoose = require("mongoose")
const User = require("../model/userModel")
const { adminSeeder } = require("../adminSeeded")


exports.datbaseConnect = async (URI)=>{
 mongoose.connect(URI)
    console.log("database is connect successfully")
    
    adminSeeder()
   

}