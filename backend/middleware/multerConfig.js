const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req,file, cb){
         const allowFileType = ["image/jpg","image/png","image/jpeg"]
         if(!allowFileType.includes(file.mimetype)){
            cb(new Error("this file is not support"))
            return
         }

         cb(null, "./upload")
    },
    filename:function(req, file, cb){
        cb(null, Date.now()+"-"+file.originalname) //error, success
    }
})

module.exports={
    multer,
    storage
}