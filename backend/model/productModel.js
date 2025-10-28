const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:[true, "ProductName must be provide"]
    },
    productDescription:{
        type:String,
        required:[true, "productDescription must be provide"]
    },
    productStockQty:{
        type:Number,
        required:[true, "productStockQtn must be provide"]
    },
    productPrice:{
        type:Number,
        required:[true, "productPrice must be provide"]
    },
    productStatus:{
        type:String,
        enum:["available","unavilable"]
    },
    qantity:{
        type:Number
    },
    productImage:String,
    
},{
    timestamps:true
})

const Product = mongoose.model("Product", userSchema)

module.exports= Product