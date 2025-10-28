const Product = require("../../../model/productModel")
const fs= require("fs");
const Review = require("../../../model/reviewmodel");

exports.createProduct = async (req, res)=>{
 
    
  console.log(req.file)
  const filename=req.file;
  // // let filepath =fi

  // if(!filename){
  //    filepath="./helloimage.jpg"
  //   return
  // }else{
  //     filepath= filename
  // }
    
    // console.log(req.body)
    const {productName, productDescription, productPrice, productStatus,productStockQty}=req.body
    
    if(!productName || !productDescription || !productPrice || !productStatus || !productStockQty){
        return res.status(400).json({
            message:"please provide productName, productDescription, productPrice, productStatus,productStockQty"
        })
    }


  const productCreate = await Product.create({
           productName,
           productDescription,
           productStockQty,
           productStatus,
           productPrice,
           productImage:filename
  })

    res.status(201).json({
        message:"product create successfully",
        data:productCreate
    })
    
  

}


exports.getProducts = async(req, res)=>{
  
  const productReviews = await Review.find({productId :id }).populate("userId")

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

   fs.unlink("./upload"+ preproductimage,(err)=>{
    if(err){
      console.log("error deleting file",err)
    }else{
      console.log("file delete successfully")
    }
   } )

   await Product.findByIdAndDelete(id)
   res.status(200).json({
    message:"product is delete successfully",
    data:prevdata
   })
}

exports.editproduct = async(req, res)=>{
  const {id}= req.params;

  const {productName, productDescription, productPrice, productStatus,productStockQty}=req.body

  if(!productName || !productDescription || !productPrice || !productStatus || !productStockQty){
        return res.status(400).json({
            message:"please provide productName, productDescription, productPrice, productStatus,productStockQty"
        })
    }

    const predata = await Product.findById(id)
    const predataimage = predata.productImage

       if(req.file && req.file.filename){
        fs.unlink("./upload"+predataimage, (err)=>{
          if(err){
            conolse.log("error in file", err)
          }else{
            console.log("product image delete succesfully")
          }
        })
       }

    
  const datas = await Product.findByIdAndUpdate(id,{
     productName,
productDescription,
productStockQty,
productStatus,
productPrice,
productImage: req.file && req.file.filename ? req.file.filename: predataimage
  })


  res.status(200).json({
    message:"product update successfully",
    data:datas
  })

}