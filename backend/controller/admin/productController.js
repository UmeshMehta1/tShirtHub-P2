const Product = require("../../model/productModel")

exports.createProduct = async (req, res)=>{
  console.log(req.file)
  const filename=req.file.path;
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