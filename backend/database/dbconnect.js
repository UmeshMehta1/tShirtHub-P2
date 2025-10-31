const mongoose = require("mongoose")
const User = require("../model/userModel")
const { adminSeeder } = require("../adminSeeded")


exports.datbaseConnect = async (URI)=>{
    try {
        await mongoose.connect(URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        console.log("database is connect successfully")
        
        await adminSeeder()
    } catch (error) {
        console.error("Database connection error:", error.message)
        process.exit(1)
    }
}