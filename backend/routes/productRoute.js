const { createProduct } = require("../controller/admin/productController")
const isAutenticated = require("../middleware/isAuthenticated")
const restrictTo = require("../middleware/restrictTo")
const {multer, storage}= require("../middleware/multerConfig")
const upload = multer({storage:storage})

const router= require("express").Router()




router.route("/createproduct").post(isAutenticated,restrictTo("admin"),upload.single("productImage"), createProduct)


module.exports= router