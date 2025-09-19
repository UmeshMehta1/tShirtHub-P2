const Product = require("../../model/productModel")

exports.createProduct = async (req, res)=>{
    
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
  })

    res.status(201).json({
        message:"product create successfully",
        data:productCreate
    })
}