const Order = require("../../../model/orderModel")



exports.getAllOrders = async(req, res)=>{
    const orders = await Order.find().populate({
        path:"items.product",
        model:"Product"
    }).populate("user")
   
    if(orders.length ==0){
        return res.status(404).josn({
            message:"No orders",
            data:[]
        })
    }

    // const userId= req.user.id

    res.status(200).json({
        message:"order fetch successfulllly",
        data:orders


    })
 
}

exports.getSingleOrder = async(req, res)=>{
    const {id} = req.params
     const order = await Order.findById(id)
     if(!order){
        return res.status(404).json({
            message:"No order found with that id"
        })
     }

     res.status(200).josn({
        message:"order fetch successfully",
        data:order
     })
}


exports.updateOrderStatus = async(req,res)=>{
    const {id}= req.params
    const {orderStatus} = req.body

    if(!orderStatus || !["pending","delivered","cancelled", "ontheway","preparation" ].includes(orderStatus.toLowerCase())){
        return res.status(400).json({
            message:"orderStats is invalid or should be provided"
        })
    }

    const order = await Order.findById(id)
    if(!order){
        return res.status(404).json({
            message:"order not found with that id"
        })
    } 

    const updatedOrder = await Order.findByIdAndUpdate(id,{
        orderStatus
    },{new:true}).populate({
        path:"items.product",
        model:"Product"
    }).populate("user")




    let nessaryData

    if("orderStatus" === "delivered"){
        nessaryData = updatedOrder.items.map((item)=>{
            return({
                quantity:item.quantity,
                productId:item.product._id,
                productStockQty:item.product.productStockQty
            })
        })
    }


    for(let i = 0;i<nessaryData.length;i++){
        await Product.findByIdAndUpdate(nessaryData[id].productId,{
            productStockQty:nessaryData[i].productStockQty-nessaryData[i].quantity
        })
    }


    res.status(200).json({
        message:"order status updated successfully",
        data:updatedOrder
    })
}


exports.updatePaymentStatus = async(req, res)=>{
    const {id} = req.params
    const {paymentStatus}= req.body   //{"paymentStatus":"paid"}
    
    if(!paymentStatus  || !["paid", "unpade","pending"].includes(paymentStatus.toLowerCase())){
        return res.status(400).josn({
            message:"paymentstatus is invalid or should be provide"
        })
    }

   const order = await Order.findById(id)
   if(!order){
    return res.status.josn({
        message:"nor order found with thata id"
    })
   }

   const updatedOrder = await Order.findByIdAndUpdate(id,{
       "paymentDetails.status":paymentStatus

   }, {new:true}).populate({
    path:"items.product",
    model:"Product"
   }).populate('user')
   
   res.status(200).json({
    message:"order status updated successfully",
    data:updatedOrder
   })
}


exports.deleteOrder= async(req,res)=>{
    const {id}=req.param   //delete http://localhost:3000/order/orderId
    const order = await Order.findById(id)
    if(!order){
        return res.status(404).json({
            messagew:"neo order found with that id"
        })
    }

    await Order.findByIdAndDelete(id)
    res.status(200).json({
        message:"order deleted successfully",
        data:null
    })
}
