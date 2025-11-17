const Product = require("../../../model/productModel")
const fs= require("fs");
const Review = require("../../../model/reviewmodel");

exports.createProduct = async (req, res)=>{
    try {
        const {productName, productDescription, productPrice, productStatus,productStockQty}=req.body
    
    if(!productName || !productDescription || !productPrice || !productStatus || !productStockQty){
        return res.status(400).json({
            message:"please provide productName, productDescription, productPrice, productStatus,productStockQty"
        })
    }

    // Normalize productStatus to lowercase and validate
    const normalizedStatus = productStatus.toLowerCase().trim()
    if(normalizedStatus !== 'active' && normalizedStatus !== 'inactive'){
        return res.status(400).json({
            message:"productStatus must be either 'active' or 'inactive'"
        })
    }

  const productCreate = await Product.create({
           productName,
           productDescription,
           productStockQty,
           productStatus: normalizedStatus,
           productPrice,
           productImage: req.file ? req.file.filename : null
  })

        return res.status(201).json({
            message:"product create successfully",
            data:productCreate
        })
    } catch (error) {
        console.error('Create product error:', error)
        return res.status(400).json({
            message: error.message || "Failed to create product"
        })
    }
}


exports.getProducts = async(req, res)=>{
  const productReviews = await Review.find().populate("userId")
  const products = await Product.find()

  if(products.length===0){
    res.status(400).json({
      message:"product is not found"
    })
  }else{
    res.status(200).json({
      message:"product fetch successfully",
      data:products,
      review:productReviews
    })
  }

}

exports.getsingleproduct = async(req,res)=>{
 const {id} = req.params

 if(!id){
  return res.status(400).json({
    message:"please provide product id"
  })
 }


 const product = await Product.find({_id:id})

 const productReviews = await Review.find({productId:id}).populate("userId")

 if(product==0){
   return res.status(400).json({
      message:"product is not found with this id"
     })
 }
  return res.status(200).json({
    message:"single product is fetch successfully",
    data:product,
    productReviews
  })

}

exports.deleteproduct = async(req, res)=>{
   const {id}= req.params

   if(!id){
    return res.status(400).json({
      message:"please provide product id"
    })
   }

   const prevdata= await Product.findById(id);

   if(!prevdata){
      return res.status(400).json({
        message:"no product found with that id"
      })
   }

   const preproductimage = prevdata.productImage

   if(preproductimage){
     fs.unlink("./upload/" + preproductimage,(err)=>{
      if(err){
        console.log("error deleting file",err)
      }else{
        console.log("file delete successfully")
      }
     } )
   }

   await Product.findByIdAndDelete(id)
   res.status(200).json({
    message:"product is delete successfully",
    data:prevdata
   })
}

exports.editproduct = async(req, res)=>{
  try {
    const {id}= req.params;

    const {productName, productDescription, productPrice, productStatus,productStockQty}=req.body

    if(!productName || !productDescription || !productPrice || !productStatus || !productStockQty){
        return res.status(400).json({
            message:"please provide productName, productDescription, productPrice, productStatus,productStockQty"
        })
    }

    // Normalize productStatus to lowercase and validate
    const normalizedStatus = productStatus.toLowerCase().trim()
    if(normalizedStatus !== 'active' && normalizedStatus !== 'inactive'){
        return res.status(400).json({
            message:"productStatus must be either 'active' or 'inactive'"
        })
    }

    const predata = await Product.findById(id)
    if(!predata){
        return res.status(404).json({
            message:"Product not found"
        })
    }
    
    const predataimage = predata.productImage

    if(req.file && req.file.filename && predataimage){
        fs.unlink("./upload/" + predataimage, (err)=>{
          if(err){
            console.log("error in file", err)
          }else{
            console.log("product image delete succesfully")
          }
        })
    }

    const datas = await Product.findByIdAndUpdate(id,{
        productName,
        productDescription,
        productStockQty,
        productStatus: normalizedStatus,
        productPrice,
        productImage: req.file && req.file.filename ? req.file.filename: predataimage
    }, { new: true, runValidators: true })

    return res.status(200).json({
        message:"product update successfully",
        data:datas
    })
  } catch (error) {
    console.error('Update product error:', error)
    return res.status(400).json({
        message: error.message || "Failed to update product"
    })
  }
}