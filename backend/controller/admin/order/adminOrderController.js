const Order = require("../../../model/orderModel")


exports.getAllOrders = async(req, res)=>{
    const orders = await Order.find().populate({
        path:"items.product",
        model:"Product"
    }).populate("user")
   
    if(orders.length ==0){
        return rs.status(404).josn({
            message:"No orders",
            data:[]
        })
    }

    // const userId= req.user.id

    res.staus(200).json({
        message:"order fetch successfulllly"
    })
 
}

