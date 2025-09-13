const mongoose = require("mongoose")


exports.datbaseConnect = ()=>{
 mongoose.connect("mongodb+srv://hello:hello@cluster0.sdtbbxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log("database is connect successfully")

}