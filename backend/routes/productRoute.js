const { createProduct, getProducts, getsingleproduct, deleteproduct, editproduct } = require("../controller/admin/product/productController")
const isAutenticated = require("../middleware/isAuthenticated")
const restrictTo = require("../middleware/restrictTo")
const {multer, storage}= require("../middleware/multerConfig")
const catchAsync = require("../service/catchAsync")
const upload = multer({storage:storage})

const router= require("express").Router()

router.route("/").post(isAutenticated,restrictTo("admin"),upload.single("productImage"), catchAsync(createProduct))

router.route("/:id").delete(isAutenticated,restrictTo("admin"),catchAsync(deleteproduct))
router.route("/:id").patch(isAutenticated,restrictTo("admin"),catchAsync(editproduct))


router.route("/getproducts").get(catchAsync(getProducts))
router.route("/getproducts/:id").get(catchAsync(getsingleproduct))


module.exports= router