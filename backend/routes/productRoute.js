const { createProduct } = require("../controller/admin/productController")

const router= require("express").Router()


router.route("/createproduct").post(createProduct)


module.exports= router