const Order = require("../../../model/orderModel")
const User = require("../../../model/userModel")


exports.createOrder = async(req,res)=>{
    const userId= req.user.id

    const {shippingAddress, items, totalAmount, paymentDetails, phoneNumber}= req.body

    if(!shippingAddress || !totalAmount || !paymentDetails || !phoneNumber){
        return res.status(400).json({
            message:"please provide shippingAddress, items, totalAmount, paymentDetails, phoneNumber"
        })
    }

    const createOrder = await Order.create({
        user:userId,
        shippingAddress,
        totalAmount,
        items,
        paymentDetails,
        phoneNumber
    })

const user = await User.findById(userId);

user.cart=[]

await user.save()

res.status(200).json({
    message:"order created successfull",
    data:createOrder
})

}


exports.getMyorders = async(req,res)=>{
    const userId = req.user.id
    const orders = await Order.find({user:userId}).populate({
        path:"items.product",
        model:"Product",
        select:"-productStockQty -createdAt -updatedAt -review -_v"
    })

    if(orders.length ==0){
        return res.status(404).json({
            message:"No order",
            data:[]
        })
    }

    res.status(200).json({
        message:"order fetched successfully",
        data:orders
    })
}


exports.updateMyOrder = async(req, res)=>{
    const userId = req.user.id
    const {id}= req.params
    const {shippingAddress, items} = req.body

    if(!shippingAddress || !items.length==0){
        return res.status(400).json({
            message:"please privde shipping Address and items"
        })
    }

    const existingOrder = await Order.findById(id)
    if(!existingOrder){
        return res.status(400).json({
            message: "no order with that id"
        })
    }

    if(existingOrder.user !==userId){
        return res.status(400).json({
            message:"you don't have permission to update this order"
        })
    }

    if(existingOrder.orderStatus == "ontherway"){
        return res.satus(403).json({
            message:"you cannot update when order is notheway"
        })
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, {shipping, items}, {new:true})

    res.satus(200).json({
        message:"order updated successfully",
        data: updatedOrder
    })
}


exports.deleteMyOrder = async(req, res)=>{
    const userId = req.user.id
    const {id}= req.params

    const order = await Order.findById(id)

    if(!order){
        return res.status(400).json({
            message:"No order with that id"
        })
    }

    if(order.user != userId){
        return res.status(400).json({
            message:"you cannot delete this order"
        })
    }

    if(order.orderStatus !=="pending"){
        return res.status(400).json({
            message:"you cannot delete this order as it is not pending"
        })
    }


    await Order.findByIdAndDelete(id)
    res.status(200).json({
        message:"order delete successfully",
        data:null
    })
}

exports.cancelOrder= async(req,res)=>{
    const {id}=req.body
    const userId = req.user.id

    const order = await Order.findById(id)

    if(!order){
        return res.status(400).json({
            message:"no order with that id"
        })
    }

    if(order.user != userId){
       return res.status(400).json({
        message:"you cannot have permission to cancel this order "
       })
    }

    if(order.orderStatus !=="pending"){
        return res.status(400).json({
            message:"you cannot cancel this order as it si not pending"
        })
    }


    const updateOrder = await Order.findByIdAndUpdate(id,{
        orderStatus:"cancelled"

    }, {new:true})
    

    res.status(200).json({
        message:"order cancelled successfully",
        data:updateOrder
    })
}