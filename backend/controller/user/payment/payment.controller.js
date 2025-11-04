
const axios = require("axios")
const Order = require("../../../model/orderModel")
const User = require("../../../model/userModel")


exports.initiateKhaltiPayment = async (req, res) => {
    try {

        const {orderId,amount}= req.body

        if(!orderId || !amount){
            return res.status(400).json({
                message:"please provider orderId, amount"
            })
        }


        const order = await Order.findById(orderId)
        if(!order){
            return res.status(404).json({
                message:"order not found with that id"
            })
        }
   
        if(order.totalAmount !== amount){
              return res.status(400).json({
                message:"amount must be equal to totalAmount"
              })
        }


        const data = {
            return_url: "http://localhost:3000/success",
            website_url: "http://localhost:3000",
            purchase_order_id: orderId,
            purchase_order_name: "orderName_"+orderId,
            amount: amount*100,
        }

        // axios expects `headers` (plural). Also ensure the API key format matches the provider's docs
        const response = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/initiate/",
            data,
            {
                headers: {
                    // Khalti expects 'Key <your_key>' or 'key <your_key>' depending on docs — keep casing exact.
                    Authorization: "Key 88394f9c6a2d4bb080f0bf398998d3da",
                },
            }
        )

        order.paymentDetails.pidx = response.data.pidx


        await order.save()
        return res.status(200).json({
            message: "payment test",
            payment: response.data,
        })
    } catch (error) {
        // Log and surface useful details for debugging 401s
        console.error("Khalti initiate error:", error?.response?.status, error?.response?.data || error.message)
        const status = error?.response?.status || 500
        const data = error?.response?.data || { message: error.message }
        return res.status(status).json({ success: false, error: data })
    }
}

exports.verifyPidx = async(req,res)=>{
//  const userId = req.user.id
   const pidx = req.body.pidx

   const response = await axios.post("https://dev.khalti.com/api/v2/epayment/epayment/lookup/",{pidx},{
    
    headers:{
        "Authorization":"key 88394f9c6a2d4bb080f0bf398998d3da"
    }
   })

   if(response.data.status=="Completed"){
     let order = await Order.find({"paymentDetails.pidx":pidx})

     order[0].paymentDetails.method ="khalti"
     order[0].paymentDetails.status ="paid"

     await order[0].save()

     const user = await User.findById(userId)
     
     user.cart=[]

     await user.save()

     res.status(200).json({
        message:"payment verified successfully"
     })

   }
}