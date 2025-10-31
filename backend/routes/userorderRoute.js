
const { getMyorders, createOrder, cancelOrder, updateMyOrder, deleteMyOrder } = require("../controller/user/order/orderController")
const isAutenticated = require("../middleware/isAuthenticated")
// const restrictTo = require("../middleware/restrictTo")
// const catchAsync = reqire("../")

const router = require("express").Router()

router.route("/").get(isAutenticated, getMyorders).post(isAutenticated, createOrder)
router.route("/cancel").patch(isAutenticated, cancelOrder)
router.route("/:id").patch(isAutenticated, updateMyOrder).delete(isAutenticated, deleteMyOrder)


module.exports = router