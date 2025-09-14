const mongoose = require("mongoose")


exports.datbaseConnect = (URI)=>{
 mongoose.connect(URI)
    console.log("database is connect successfully")

}