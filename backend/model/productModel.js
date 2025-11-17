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
        enum:["active","inactive"],
        default:"active"
    },
    qantity:{
        type:Number
    },
    productImage:String,
    
},{
    timestamps:true
})

// Delete the model from all possible caches to avoid caching issues
if (mongoose.models.Product) {
    delete mongoose.models.Product
}
if (mongoose.connection && mongoose.connection.models && mongoose.connection.models.Product) {
    delete mongoose.connection.models.Product
}

const Product = mongoose.model("Product", userSchema)

module.exports= Product