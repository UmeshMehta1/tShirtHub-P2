const Product = require("../../model/productModel")
const Review = require("../../model/reviewmodel")


exports.createReview = async(req,res)=>{
    const userId = req.user.id
    
    const{rating, message}= req.body


    const productId = req.params.id


    if(!rating || !message){
        return res.status(400).json({
            message:"please provide reading and message"
        })
    }

   
    const productExist = await Product.findById(productId)

    if(!productExist){
        return res.status(400).json({
            message:"product with that productId does not match"
        })
    }
  const review = await Review.create({
        userId,
        productId,
        rating,
        message
    })
    res.status(200).json({
        message:"review added successfully",
        review
    })
}

exports.getMyReviews = async(req, res)=>{
    const userId = req.user.id
    
    const review = await Review.find({userId})

    if(review.length==0){
        message:"you havent't given review on that product"
    }else{
        res.status(200).json({
            message:"review fetch successfully",
            data:review
        })
    }

}


//delet review 