const { addToCart, deleteItemFromCart, updateCartItems, getMyCartItems } = require("../controller/user/cart/cart.controller")
const isAutenticated = require("../middleware/isAuthenticated")


const router = require("express").Router()

router.route("/product/:productId").post(isAutenticated, addToCart).delete(isAutenticated, deleteItemFromCart).patch(isAutenticated, updateCartItems)
router.route("/").get(isAutenticated, getMyCartItems)


module.exports = router