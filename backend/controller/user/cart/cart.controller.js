const Product = require("../../../model/productModel")
const User = require("../../../model/userModel")

exports.addToCart = async(req, res)=>{
    const userId = req.user.id
    const {productId}= req.params

    if(!productId){
        return res.status(400).json({
            message:"please provide productId"
        })
    }

    const productExist = await Product.findById(productId)

    if(!productExist){
        return res.status(400).json({
            message:"product is not found"
        })
    }
    
    const user = await User.findById(userId)
     
    const existCartItem = await user.cart.find((item)=>item.product.equals(productId))

    if(existCartItem){
        existCartItem.quantity +=1
    }else{
        user.cart.push({
            product:productId,
            quantity:1
        })
    }

    await user.save()
    const updateUser = User.findById(userId).populate("cart.product")

    res.status(200).json({
        message:"product added to cart",
        data:updateUser.cart
    })

}


exports.getMyCartItems = async(req, res)=>{
    const userId= req.user.id
    const userData = await User.findById(userId).populate({
        path:"cart.product",
        select:"-productStatus"
    })

    res.status(200).json({
        message:"cart item fetch successfully",
        data: userData.cart
    })
}

exports.deleteItemFromCart = async(req, res)=>{
    const {productId}= req.params
    const userId = req.user.id

    const product = await Product.findById(productId)

    if(!product){
        return  res.status(404).json({
            message:"no product with that productId"
        })
    }

    const user = await User.findById(userId)
    
    user.cart = user.cart.filter((item)=>item.product !=productId) // const retnum= [1, 3, 5, 3, 6, 9].filter((item)=>item != 6)
          
    //retnum=[1, 3, 5, 3, 9]

    await user.save()


    return res.status(200).json({
        message:"item remove successfully"
    })
}


exports.updateCartItems = async(req, res)=>{
    const userId= req.user.id
    const {productId}= req.params

    const {quantity}= req.body

    const user= await User.findById(userId)

    const cartItem= user.cart.find((item)=>item.product.equals(productId))

    if(!cartItem){
        return res.status(400).json({
            message:"no item with that productId"
        })
    }

    cartItem.quantity= quantity

    await user.save()

    res.status(200).json({
        message:"item updated successfully",
        data:user.cart
    })
}