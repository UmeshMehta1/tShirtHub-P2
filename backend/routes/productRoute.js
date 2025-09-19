const { createProduct } = require("../controller/admin/productController")
const isAutenticated = require("../middleware/isAuthenticated")

const router= require("express").Router()


router.route("/createproduct").post(isAutenticated, createProduct)


module.exports= router